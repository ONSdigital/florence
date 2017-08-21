#!groovy

node {
    stage('Checkout') {
        checkout scm
        sh 'git clean -dfx'
        sh 'git rev-parse --short HEAD > git-commit'
        sh 'set +e && (git describe --exact-match HEAD || true) > git-tag'
    }

    stage('Build') {
        sh 'npm install --no-bin-links'
    }

    stage('Bundle') {
        def revision = revisionFrom(readFile('git-tag').trim(), readFile('git-commit').trim())
        sh "aws s3 cp --acl public-read --cache-control max-age=1209600 --recursive dist s3://${env.S3_CDN_BUCKET}/sixteens/${revision}/"
    }
}

@NonCPS
def revisionFrom(tag, commit) {
    def matcher = (tag =~ /^release\/(\d+\.\d+\.\d+(?:-rc\d+)?)$/)
    matcher.matches() ? matcher[0][1] : commit
}
