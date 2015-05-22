#!/bin/bash

ROOT_DIRECTORY="`cd "..";pwd`" # assumed we are in one of the folders of a git project, so jumps out of it.
FLORENCE_DIRECTORY="$ROOT_DIRECTORY/florence-user-test"
ZEBEDEE_DIRECTORY="$ROOT_DIRECTORY/zebedee-user-test"
TREDEGAR_DIRECTORY="$ROOT_DIRECTORY/tredegar-user-test"

MR_RUSTY_DIRECTORY="$ROOT_DIRECTORY/MrRusty"
#MR_RUSTY_DIRECTORY="/mr-rusty-user-test"

export FLORENCE_HOST="http://florence-user-test.herokuapp.com/"
export ZEBEDEE_HOST="http://zebedee-user-test.herokuapp.com/"
export TREDEGAR_HOST="http://tredegar-user-test.herokuapp.com/"

function update_branch {

    echo "Updating $3 branch of $1 into $2"

    # if the directory does no exist we need to clone the repo.
    if [ ! -e $2 ]
    then
        git clone $1 $2
    fi

    # get the latest for the given branch
    cd $2
    git checkout $3
    git checkout . # remove any local changes
    git pull --rebase origin $3
}

function update_branch_and_push {
    update_branch $1 $2 $3
    git push origin $3:user-test
}

function update_florence {
    update_branch $1 $2 $3
    ./build-js.sh
    git commit . -m "Build JS for deployment."
    git push origin $3:user-test
}

function send_slack_message {
    echo $1
    #curl --data "$1" $'https://onsbeta.slack.com/services/hooks/slackbot?token=ZhoG2gy2TTTBMhtODncuprDQ&channel=%23github'
}

function run_tests {

    # build the tests
    mvn package

    echo "Running tests..."

    # run the tests, and add the output to the output variable
    export output=$(java $JAVA_OPTS -cp 'target/*' com.github.onsdigital.TestRunner)
    echo "Tests complete"

    send_slack_message "Automation test results: $output"
}

send_slack_message "Deploying to user test environment."

# update all projects concurrently with & wait
update_florence https://github.com/ONSdigital/florence.git $FLORENCE_DIRECTORY chart-builder &
update_branch_and_push https://github.com/Carboni/zebedee.git $ZEBEDEE_DIRECTORY develop &
update_branch_and_push https://github.com/ONSdigital/tredegar.git $TREDEGAR_DIRECTORY develop
wait

#update_branch https://github.com/Carboni/MrRusty.git $MR_RUSTY_DIRECTORY master
#cd "$MR_RUSTY_DIRECTORY"
#run_tests


