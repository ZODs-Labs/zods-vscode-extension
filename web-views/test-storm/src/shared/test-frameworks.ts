export const testFrameworks = [
   {
      languages: ['js', 'ts', 'jsx', 'tsx', 'javascript', 'typescript'],
      default: 'jest',
      frameworks: [
         {
            value: 'jest',
            label: 'Jest',
         },
         {
            value: 'mocha',
            label: 'Mocha',
         },
         {
            value: 'jasmine',
            label: 'Jasmine',
         },
         {
            value: 'karma',
            label: 'Karma',
         },
         {
            value: 'cyress',
            label: 'Cypress',
         },
      ],
   },
   {
      languages: ['cs', 'csharp'],
      default: 'xunit',
      frameworks: [
         {
            value: 'xunit',
            label: 'xUnit',
         },
         {
            value: 'nunit',
            label: 'NUnit',
         },
         {
            value: 'mstest',
            label: 'MSTest',
         },
      ],
   },
   {
      languages: ['py', 'python'],
      default: 'pytest',
      frameworks: [
         {
            value: 'pytest',
            label: 'PyTest',
         },
         {
            value: 'unittest',
            label: 'unittest',
         },
         {
            value: 'nose',
            label: 'Nose',
         },
         {
            value: 'doctest',
            label: 'doctest',
         },
         {
            value: 'hypothesis',
            label: 'Hypothesis',
         },
      ],
   },
   {
      languages: ['java'],
      default: 'junit',
      frameworks: [
         {
            value: 'junit',
            label: 'JUnit',
         },
         {
            value: 'testng',
            label: 'TestNG',
         },
         {
            value: 'spock',
            label: 'Spock',
         },
         {
            value: 'mockito',
            label: 'Mockito',
         },
         {
            value: 'assertj',
            label: 'AssertJ',
         },
      ],
   },
   {
      languages: ['go'],
      default: 'go-test',
      frameworks: [
         {
            value: 'go-test',
            label: 'Go Test',
         },
         {
            value: 'goconvey',
            label: 'GoConvey',
         },
         {
            value: 'ginkgo',
            label: 'Ginkgo',
         },
         {
            value: 'testify',
            label: 'Testify',
         },
         {
            value: 'gomega',
            label: 'Gomega',
         },
      ],
   },
   {
      languages: ['php'],
      default: 'phpunit',
      frameworks: [
         {
            value: 'phpunit',
            label: 'PHPUnit',
         },
         {
            value: 'codeception',
            label: 'Codeception',
         },
         {
            value: 'phpspec',
            label: 'PHPSpec',
         },
         {
            value: 'behat',
            label: 'Behat',
         },
         {
            value: 'simpletest',
            label: 'SimpleTest',
         },
      ],
   },
   {
      languages: ['rb', 'ruby'],
      default: 'rspec',
      frameworks: [
         {
            value: 'rspec',
            label: 'RSpec',
         },
         {
            value: 'minitest',
            label: 'Minitest',
         },
         {
            value: 'testunit',
            label: 'Test::Unit',
         },
         {
            value: 'cucumber',
            label: 'Cucumber',
         },
         {
            value: 'capybara',
            label: 'Capybara',
         },
      ],
   },
   {
      languages: ['rust'],
      default: 'native',
      frameworks: [
         {
            value: 'native',
            label: 'Native',
         },
         {
            value: 'spec',
            label: 'Spec',
         },
      ],
   },
   {
      languages: ['swift'],
      default: 'xctest',
      frameworks: [
         {
            value: 'xctest',
            label: 'XCTest',
         },
         {
            value: 'quick',
            label: 'Quick',
         },
         {
            value: 'kiwi',
            label: 'Kiwi',
         },
         {
            value: 'spectre',
            label: 'Spectre',
         },
      ],
   },
   {
      languages: ['kotlin'],
      default: 'junit',
      frameworks: [
         {
            value: 'junit',
            label: 'JUnit',
         },
         {
            value: 'kotest',
            label: 'Kotest',
         },
      ],
   },
];
