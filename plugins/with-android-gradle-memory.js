const { withGradleProperties } = require("@expo/config-plugins");

const GRADLE_JVM_ARGS_PROPERTY = "org.gradle.jvmargs";
const ANDROID_RELEASE_GRADLE_JVM_ARGS = "-Xmx2048m -XX:MaxMetaspaceSize=1024m";

/** Give R8 enough Metaspace to optimize the Android release build. */
module.exports = function withAndroidGradleMemory(config) {
  return withGradleProperties(config, function setAndroidGradleMemory(gradleConfig) {
    const currentProperty = gradleConfig.modResults.find(
      (item) => item.type === "property" && item.key === GRADLE_JVM_ARGS_PROPERTY,
    );

    if (currentProperty?.type === "property") {
      currentProperty.value = ANDROID_RELEASE_GRADLE_JVM_ARGS;
    } else {
      gradleConfig.modResults.push({
        type: "property",
        key: GRADLE_JVM_ARGS_PROPERTY,
        value: ANDROID_RELEASE_GRADLE_JVM_ARGS,
      });
    }

    return gradleConfig;
  });
};
