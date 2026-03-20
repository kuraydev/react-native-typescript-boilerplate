# frozen_string_literal: true
lib = File.expand_path('../lib/', __FILE__)
$:.unshift lib unless $:.include?(lib)

require 'ethon/version'

Gem::Specification.new do |s|
  s.name         = "ethon"
  s.version      = Ethon::VERSION
  s.platform     = Gem::Platform::RUBY
  s.authors      = ["Hans Hasselberg"]
  s.email        = ["me@hans.io"]
  s.homepage     = "https://github.com/typhoeus/ethon"
  s.summary      = "Libcurl wrapper."
  s.description  = "Very lightweight libcurl wrapper."

  s.required_ruby_version = ">= 2.6"
  s.license = 'MIT'

  s.add_dependency('ffi', ['>= 1.15.0'])
  s.add_dependency('logger')

  s.files = Dir.chdir(__dir__) do
    `git ls-files -z`.split("\x0").reject do |file|
      file.start_with?(*%w[. Gemfile Guardfile Rakefile profile spec])
    end
  end
  s.require_path = 'lib'

  s.metadata              = {
    'bug_tracker_uri'       => 'https://github.com/typhoeus/ethon/issues',
    'changelog_uri'         => "https://github.com/typhoeus/ethon/blob/v#{s.version}/CHANGELOG.md",
    'documentation_uri'     => "https://www.rubydoc.info/gems/ethon/#{s.version}",
    'rubygems_mfa_required' => 'true',
    'source_code_uri'       => "https://github.com/typhoeus/ethon/tree/v#{s.version}"
  }
end
