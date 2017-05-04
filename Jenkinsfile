#!groovy

node {
    def gopath = pwd()

    ws("${gopath}/src/github.com/ONSdigital/florence") {
        stage('Checkout') {
            checkout scm
            sh 'git clean -dfx'
            sh 'git rev-parse --short HEAD > git-commit'
            sh 'set +e && (git describe --exact-match HEAD || true) > git-tag'
        }

        def branch   = env.JOB_NAME.replaceFirst('.+/', '')
        def revision = revisionFrom(readFile('git-tag').trim(), readFile('git-commit').trim())

        stage('Build') {
            if (revision.size() > 1) writeVersion(revision[1, 2, 3])
            sh 'npm install --no-bin-links --prefix ./src'
            sd 'npm install --no-bin-links --prefix ./src/legacy'
            sh "GOPATH=${gopath} make"
        }

        stage('Test') {
            sh "GOPATH=${gopath} make test"
        }

        stage('Image') {
            docker.withRegistry("https://${env.ECR_REPOSITORY_URI}", { ->
                docker.build('florence', '--no-cache --pull --rm .').push(revision)
            })
        }

        stage('Bundle') {
            sh sprintf('sed -i -e %s -e %s -e %s -e %s -e %s appspec.yml scripts/codedeploy/*', [
                "s/\\\${CODEDEPLOY_USER}/${env.CODEDEPLOY_USER}/g",
                "s/^CONFIG_BUCKET=.*/CONFIG_BUCKET=${env.S3_CONFIGURATIONS_BUCKET}/",
                "s/^ECR_REPOSITORY_URI=.*/ECR_REPOSITORY_URI=${env.ECR_REPOSITORY_URI}/",
                "s/^GIT_COMMIT=.*/GIT_COMMIT=${revision}/",
                "s/^AWS_REGION=.*/AWS_REGION=${env.AWS_DEFAULT_REGION}/",
            ])
            sh "tar -cvzf florence-${revision}.tar.gz appspec.yml scripts/codedeploy"
            sh "aws s3 cp florence-${revision}.tar.gz s3://${env.S3_REVISIONS_BUCKET}/"
        }

        def deploymentGroups = deploymentGroupsFor(env.JOB_NAME.replaceFirst('.+/', ''))
        if (deploymentGroups.size() < 1) return

        stage('Deploy') {
            def appName = 'florence'
            for (group in deploymentGroups) {
                sh sprintf('aws deploy create-deployment %s %s %s,bundleType=tgz,key=%s', [
                    "--application-name ${appName}",
                    "--deployment-group-name ${group}",
                    "--s3-location bucket=${env.S3_REVISIONS_BUCKET}",
                    "${appName}-${revision}.tar.gz",
                ])
            }
        }
    }
}

def deploymentGroupsFor(branch) {
    if (branch == 'develop') {
        return [env.CODEDEPLOY_PUBLISHING_DEPLOYMENT_GROUP]
    }
    if (branch == 'dd-develop') {
        return [env.CODEDEPLOY_DISCOVERY_PUBLISHING_DEPLOYMENT_GROUP]
    }
    if (branch == 'dd-master') {
        return [env.CODEDEPLOY_DISCOVERY_ALPHA_PUBLISHING_DEPLOYMENT_GROUP]
    }
    return []
}

@NonCPS
def revisionFrom(tag, commit) {
    def matcher = (tag =~ /^release\/((\d+)\.(\d+)\.(\d+)(?:-rc\d+)?)$/)
    matcher.matches() ? matcher[0][1, 2, 3, 4] : [commit]
}

def writeVersion(versions) {
    def file = 'dist/legacy-assets/version.json'
    def json = new groovy.json.JsonBuilder([major: versions[0], minor: versions[1], build: versions[2]]).toString()
    writeFile file: file, text: json
}
