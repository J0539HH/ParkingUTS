#!/usr/bin/env rake

require 'json'
require File.expand_path('../lib/bootstrap4_datetime_picker_rails/version', __FILE__)

desc 'Update assets'
task :update do

  checkout_branch = '5.0.0'

  if Dir.exist?('tempus-dominus-source')
    system("cd tempus-dominus-source && git checkout master && git pull && git checkout #{checkout_branch}")
  else
    system('git clone https://github.com/tempusdominus/bootstrap-4.git tempus-dominus-source')
    system("cd tempus-dominus-source && git checkout #{checkout_branch}")
  end

  system('cp tempus-dominus-source/build/css/tempusdominus-bootstrap-4.css vendor/assets/stylesheets/tempusdominus-bootstrap-4.css')
  system('cp tempus-dominus-source/build/css/tempusdominus-bootstrap-4.min.css vendor/assets/stylesheets/tempusdominus-bootstrap-4.min.css')
  system('cp tempus-dominus-source/build/js/tempusdominus-bootstrap-4.js vendor/assets/javascripts/tempusdominus-bootstrap-4.js')
  system('cp tempus-dominus-source/build/js/tempusdominus-bootstrap-4.min.js vendor/assets/javascripts/tempusdominus-bootstrap-4.min.js')
  system('git status')

  puts "\n"
  puts "tempusdominus-bootstrap-4 version:       #{JSON.parse(File.read('./tempus-dominus-source/package.json'))['version']}"
  puts "tempus-dominus-datetime-picker-rails version: #{Bootstrap4DatetimePickerRails::Rails::VERSION}"
end

desc 'Build'
task 'build' do
  system('gem build bootstrap4_datetime_picker_rails.gemspec')
end

desc 'Build and publish the gem'
task publish: :build do
  tags = `git tag`.split
  current_version = Bootstrap4DatetimePickerRails::Rails::VERSION
  system("git tag -a #{current_version} -m 'Release #{current_version}'") unless tags.include?(current_version)
  system("gem push bootstrap4-datetime-picker-rails-#{current_version}.gem")
  system('git push --follow-tags')
end

task release: :publish do
end
