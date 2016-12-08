#!groovy

node {
    stage('Checkout') {
        checkout scm
        sh 'git clean -dfx'
        sh 'git rev-parse --short HEAD > git-commit'
        sh 'set +e && (git describe --exact-match HEAD || true) > git-tag'
    }

    def branch   = env.JOB_NAME.replaceFirst('.+/', '')
    def revision = revisionFrom(readFile('git-tag').trim(), readFile('git-commit').trim())
    def registry = registry(branch, revision[0])

    stage('Build') {
        if (revision.size() > 1) writeVersion(revision[1, 2, 3])
        sh 'npm install --no-bin-links --prefix ./src/main/web/florence'
        sh "${tool 'm3'}/bin/mvn clean package dependency:copy-dependencies"
    }

    stage('Image') {
        docker.withRegistry(registry['uri'], { ->
            sh registry['login']
            docker.build(registry['image']).push(registry['tag'])
        })
    }

    stage('Bundle') {
        sh sprintf('sed -i -e %s -e %s -e %s -e %s -e %s appspec.yml scripts/codedeploy/*', [
            "s/\\\${CODEDEPLOY_USER}/${env.CODEDEPLOY_USER}/g",
            "s/^CONFIG_BUCKET=.*/CONFIG_BUCKET=${env.S3_CONFIGURATIONS_BUCKET}/",
            "s/^ECR_REPOSITORY_URI=.*/ECR_REPOSITORY_URI=${env.ECR_REPOSITORY_URI}/",
            "s/^GIT_COMMIT=.*/GIT_COMMIT=${revision[0]}/",
            "s/^AWS_REGION=.*/AWS_REGION=${env.AWS_DEFAULT_REGION}/",
        ])
        sh "tar -cvzf florence-${revision[0]}.tar.gz appspec.yml scripts/codedeploy"
        sh "aws s3 cp florence-${revision[0]}.tar.gz s3://${env.S3_REVISIONS_BUCKET}/"
    }

    if (branch != 'develop') return

    stage('Deploy') {
        sh sprintf('aws deploy create-deployment %s %s %s,bundleType=tgz,key=%s', [
            '--application-name florence',
            "--deployment-group-name ${env.CODEDEPLOY_PUBLISHING_DEPLOYMENT_GROUP}",
            "--s3-location bucket=${env.S3_REVISIONS_BUCKET}",
            "florence-${revision[0]}.tar.gz",
        ])
    }
}

def registry(branch, tag) {
    [
        hub: [
            login: 'docker login --username=$DOCKERHUB_USER --password=$DOCKERHUB_PASS',
            image: "${env.DOCKERHUB_REPOSITORY}/florence",
            tag: 'live',
            uri: "https://${env.DOCKERHUB_REPOSITORY_URI}",
        ],
        ecr: [
            login: '$(aws ecr get-login)',
            image: 'florence',
            tag: tag,
            uri: "https://${env.ECR_REPOSITORY_URI}",
        ],
    ][branch == 'live' ? 'hub' : 'ecr']
}

@NonCPS
def revisionFrom(tag, commit) {
    def matcher = (tag =~ /^release\/((\d+)\.(\d+)\.(\d+)(?:-rc\d+)?)$/)
    matcher.matches() ? matcher[0][1, 2, 3, 4] : [commit]
}

def writeVersion(versions) {
    def file = 'src/main/web/florence/assets/version.json'
    def json = new groovy.json.JsonBuilder([major: versions[0], minor: versions[1], build: versions[2]]).toString()
    writeFile file: file, text: json
}
