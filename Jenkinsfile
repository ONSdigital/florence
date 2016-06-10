#!groovy

node {
    stage 'Checkout'
    checkout scm

    stage 'Build'
    def mvn = "${tool 'm3'}/bin/mvn"
    sh 'npm install --no-bin-links --prefix ./src/main/web/florence'
    sh "${mvn} clean package dependency:copy-dependencies"

    stage 'Image'
    sh 'git rev-parse --short HEAD > git_commit_id'
    branch  = env.JOB_NAME.replaceFirst('.+/', '')
    commit  = readFile('git_commit_id').trim()
    imgRepo = null
    imgTag  = null

    if (branch == 'develop' || branch == 'live') {
        imgTag  = branch
        imgRepo = env.DOCKERHUB_REPOSITORY
    } else {
        imgTag  = commit
        imgRepo = env.ECR_REPOSITORY_URI
    }

    def img = docker.build "${imgRepo}/florence:${imgTag}"

    stage 'Push'
    sh imgRepo == env.ECR_REPOSITORY_URI ? '$(aws ecr get-login)' : 'docker login --username=$DOCKERHUB_USER --password=$DOCKERHUB_PASS'
    img.push()
}
