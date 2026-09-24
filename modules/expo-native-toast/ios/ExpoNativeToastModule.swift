import ExpoModulesCore
import SwiftUI
import UIKit

@Record
struct NativeToastOptions {
  var id: String = ""
  var type: String
  var title: String
  var message: String?
  var duration: Int = 3_000
  var actionLabel: String?
}

@Record
struct NativeToastActionEvent {
  var id: String
}

@ExpoModule("ExpoNativeToast")
public final class ExpoNativeToastModule: Module {
  @Event
  var onAction: (NativeToastActionEvent) -> Void

  @JS
  func show(options: NativeToastOptions) {
    Task { @MainActor in
      NativeToastPresenter.shared.show(options)
    }
  }

  @JS
  func dismiss() {
    Task { @MainActor in
      NativeToastPresenter.shared.dismiss()
    }
  }
}

private enum NativeToastKind: String {
  case error
  case warning
  case info
  case success

  init(value: String) {
    self = NativeToastKind(rawValue: value) ?? .info
  }

  var symbol: String {
    switch self {
    case .error: "xmark.octagon.fill"
    case .warning: "exclamationmark.triangle.fill"
    case .info: "info.circle.fill"
    case .success: "checkmark.circle.fill"
    }
  }

  var tint: Color {
    switch self {
    case .error: .red
    case .warning: .orange
    case .info: .accentColor
    case .success: .green
    }
  }
}

@MainActor
private final class NativeToastPresenter {
  static let shared = NativeToastPresenter()

  private var dismissTask: Task<Void, Never>?
  private var hostingController: UIViewController?

  func show(_ options: NativeToastOptions) {
    guard let scene = UIApplication.shared.connectedScenes
      .compactMap({ $0 as? UIWindowScene })
      .first(where: { $0.activationState == .foregroundActive }) else {
      return
    }

    dismiss()
    let kind = NativeToastKind(value: options.type)
    playHaptic(kind)
    UIAccessibility.post(
      notification: .announcement,
      argument: [options.title, options.message].compactMap { $0 }.joined(separator: ". ")
    )

    guard
      let hostWindow = scene.windows.first(where: { $0.isKeyWindow }) ?? scene.windows.first,
      let hostController = hostWindow.rootViewController
    else {
      return
    }

    let controller = UIHostingController(
      rootView: NativeToastView(options: options, kind: kind)
    )
    controller.view.backgroundColor = .clear
    controller.view.isOpaque = false
    controller.view.frame = hostWindow.bounds
    controller.view.autoresizingMask = [.flexibleWidth, .flexibleHeight]
    controller.view.isUserInteractionEnabled = false
    controller.view.alpha = 0
    controller.view.transform = CGAffineTransform(translationX: 0, y: -16)
    hostController.addChild(controller)
    hostController.view.addSubview(controller.view)
    controller.didMove(toParent: hostController)
    hostingController = controller
    UIView.animate(
      withDuration: 0.34,
      delay: 0,
      usingSpringWithDamping: 1,
      initialSpringVelocity: 0,
      options: [.beginFromCurrentState, .allowUserInteraction]
    ) {
      controller.view.alpha = 1
      controller.view.transform = .identity
    }

    let nanoseconds = UInt64(max(options.duration, 1_000)) * 1_000_000
    dismissTask = Task { [weak self] in
      try? await Task.sleep(nanoseconds: nanoseconds)
      guard !Task.isCancelled else { return }
      self?.dismiss()
    }
  }

  func dismiss() {
    dismissTask?.cancel()
    dismissTask = nil
    hostingController?.willMove(toParent: nil)
    hostingController?.view.removeFromSuperview()
    hostingController?.removeFromParent()
    hostingController = nil
  }

  private func playHaptic(_ kind: NativeToastKind) {
    switch kind {
    case .success:
      UINotificationFeedbackGenerator().notificationOccurred(.success)
    case .warning:
      UINotificationFeedbackGenerator().notificationOccurred(.warning)
    case .error:
      UINotificationFeedbackGenerator().notificationOccurred(.error)
    case .info:
      UIImpactFeedbackGenerator(style: .soft).impactOccurred()
    }
  }
}

private struct NativeToastView: View {
  let options: NativeToastOptions
  let kind: NativeToastKind

  @State private var revealsTitle = false

  var body: some View {
    VStack {
      toastContent
        .padding(.top, 8)
        .padding(.horizontal, 12)
      Spacer()
    }
    .background(Color.clear)
    .onAppear {
      withAnimation(.spring(response: 0.34, dampingFraction: 0.9).delay(0.12)) {
        revealsTitle = true
      }
    }
    .accessibilityElement(children: .combine)
    .accessibilityLabel([options.title, options.message].compactMap { $0 }.joined(separator: ". "))
  }

  @ViewBuilder
  private var toastContent: some View {
    let content = HStack(alignment: .center, spacing: revealsTitle ? 8 : 0) {
      Image(systemName: kind.symbol)
        .font(.system(size: 16, weight: .semibold))
        .foregroundStyle(kind.tint)
        .accessibilityHidden(true)
      if revealsTitle {
        ViewThatFits(in: .horizontal) {
          Text(options.title)
            .lineLimit(1)
            .fixedSize(horizontal: true, vertical: false)
          Text(options.title)
            .lineLimit(2)
        }
        .font(.subheadline.weight(.semibold))
        .foregroundStyle(.primary)
        .multilineTextAlignment(.leading)
        .transition(.move(edge: .leading).combined(with: .opacity))
      }
    }
    .padding(.horizontal, 14)
    .padding(.vertical, 10)

    if #available(iOS 26.0, *) {
      content.glassEffect(.regular, in: .capsule)
    } else {
      content
        .background(.regularMaterial, in: Capsule())
        .overlay {
          Capsule()
            .strokeBorder(Color.primary.opacity(0.08), lineWidth: 0.5)
        }
        .shadow(color: .black.opacity(0.12), radius: 12, y: 4)
    }
  }
}
