// Jenkinsfile — busybee-website
// Vite/React + Express app — security-deps audit.
// Job naming convention: busybee-website-{suite-id}
// Jenkins credential required: "github-pat" (GitHub PAT with repo:status scope)

pipeline {
  agent any

  parameters {
    string(name: 'SUITE_ID',   defaultValue: 'security-deps', description: 'Suite ID dispatched by repo-commander')
    string(name: 'REF',        defaultValue: 'main',          description: 'Branch or tag to checkout')
    string(name: 'COMMIT_SHA', defaultValue: '',               description: 'Exact commit SHA (optional)')
  }

  environment {
    GITHUB_TOKEN = credentials('github-pat')
    CI           = 'true'
  }

  options {
    timeout(time: 30, unit: 'MINUTES')
    timestamps()
    buildDiscarder(logRotator(numToKeepStr: '50'))
  }

  stages {
    stage('Checkout') {
      steps {
        git url: 'https://github.com/Shannon1980/busybee-website.git',
            credentialsId: 'github-pat',
            branch: params.REF
      }
    }

    stage('Install deps') {
      steps {
        sh 'npm ci'
      }
    }

    stage('Run suite') {
      steps {
        script {
          switch (params.SUITE_ID) {
            case 'security-deps':
              sh 'npm audit --audit-level=high'
              break
            default:
              error("Unknown SUITE_ID: ${params.SUITE_ID}")
          }
        }
      }
    }

    stage('Post status') {
      steps {
        script {
          def sha   = params.COMMIT_SHA ?: sh(script: 'git rev-parse HEAD', returnStdout: true).trim()
          def state = currentBuild.currentResult == 'SUCCESS' ? 'success' : 'failure'
          def desc  = state == 'success' ? 'Tests passed' : 'Tests failed'
          sh """
            curl -s -X POST \
              -H "Authorization: Bearer ${GITHUB_TOKEN}" \
              -H "Content-Type: application/json" \
              https://api.github.com/repos/Shannon1980/busybee-website/statuses/${sha} \
              -d '{"state":"${state}","context":"jenkins/suite-${params.SUITE_ID}","description":"${desc}"}'
          """
        }
      }
    }
  }

  post {
    always {
      node('') {
        cleanWs()
      }
    }
  }
}
