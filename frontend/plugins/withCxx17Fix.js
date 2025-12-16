const { withDangerousMod, withPlugins } = require('@expo/config-plugins');
const fs = require('fs');
const path = require('path');

function withCxx17Fix(config) {
  return withDangerousMod(config, [
    'ios',
    async (config) => {
      const podfilePath = path.join(config.modRequest.platformProjectRoot, 'Podfile');
      
      if (fs.existsSync(podfilePath)) {
        let podfileContent = fs.readFileSync(podfilePath, 'utf8');
        
        // Check if our fix is already there
        if (!podfileContent.includes("CLANG_CXX_LANGUAGE_STANDARD")) {
          // Add the C++17 fix to the post_install block
          const postInstallFix = `
  # Fix C++17 compatibility
  installer.pods_project.targets.each do |target|
    target.build_configurations.each do |config|
      config.build_settings['CLANG_CXX_LANGUAGE_STANDARD'] = 'c++17'
    end
  end
`;
          
          // Find and modify the post_install block
          if (podfileContent.includes('post_install do |installer|')) {
            podfileContent = podfileContent.replace(
              'post_install do |installer|',
              `post_install do |installer|${postInstallFix}`
            );
          }
          
          fs.writeFileSync(podfilePath, podfileContent, 'utf8');
        }
      }
      
      return config;
    },
  ]);
}

module.exports = withCxx17Fix;
