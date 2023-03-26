
require File.expand_path('../lib/bootstrap4_datetime_picker_rails/version', __FILE__)

Gem::Specification.new do |gem|
  gem.authors       = ['Kyle Fagan']
  gem.email         = ['kfagan@mitre.org']
  gem.description   = 'Rails integration for Tempus Dominus Bootstrap 4 datetime picker'
  gem.homepage      = 'https://github.com/Bialogs/bootstrap4-datetime-picker-rails'
  gem.summary       = gem.description
  gem.license       = 'MIT'

  gem.name          = 'bootstrap4-datetime-picker-rails'
  gem.require_path  = 'lib'
  gem.version       = Bootstrap4DatetimePickerRails::Rails::VERSION
  gem.files         = Dir['README.md', "{lib,vendor}/**/*"]
  gem.add_dependency 'momentjs-rails', '~> 2.10', '>= 2.10.5'
  gem.add_dependency 'jquery-rails', '~> 4.2', '>= 4.2.0'
  gem.add_development_dependency 'bundler', '~> 1.16', '>= 1.16.0'
  gem.add_development_dependency 'json', '~> 2.1', ' >= 2.1.0'
  gem.add_development_dependency 'rake', '~> 12.3', '>= 12.3.0'
end
