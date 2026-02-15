require 'json'

package = JSON.parse(File.read(File.join(__dir__, 'package.json')))

Pod::Spec.new do |s|
  s.name           = 'watch-connectivity'
  s.version        = package['version']
  s.summary        = 'WatchConnectivity module for Expo'
  s.description    = 'Provides WatchConnectivity framework integration for Expo apps'
  s.license        = { :type => 'MIT', :file => 'LICENSE' }
  s.author         = { 'GrindIt' => 'noreply@grindit.app' }
  s.homepage       = 'https://github.com/fkoschi/grind-it'
  s.platforms      = { :ios => '13.0' }
  s.source         = { :git => '', :tag => "v#{s.version}" }
  s.static_framework = true
  s.swift_version  = '5.0'

  s.dependency 'ExpoModulesCore'

  s.source_files = "ios/**/*.{h,m,mm,swift,hpp,cpp}"
end
