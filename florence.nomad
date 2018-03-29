job "florence" {
  datacenters = ["eu-west-1"]
  region      = "eu"
  type        = "service"

  update {
    stagger      = "90s"
    max_parallel = 1
  }

  group "publishing" {
    count = "{{PUBLISHING_TASK_COUNT}}"

    constraint {
      attribute = "${node.class}"
      value     = "publishing"
    }

    task "florence" {
      driver = "docker"

      artifact {
        source = "s3::https://s3-eu-west-1.amazonaws.com/{{DEPLOYMENT_BUCKET}}/florence/{{REVISION}}.tar.gz"
      }

      config {
        command = "${NOMAD_TASK_DIR}/start-task"

        args = ["./florence"]

        image = "{{ECR_URL}}:concourse-{{REVISION}}"

        port_map {
          http = 8080
        }
      }

      service {
        name = "florence"
        port = "http"
        tags = ["publishing"]
      }

      resources {
        cpu    = "{{PUBLISHING_RESOURCE_CPU}}"
        memory = "{{PUBLISHING_RESOURCE_MEM}}"

        network {
          port "http" {}
        }
      }

      template {
        source      = "${NOMAD_TASK_DIR}/vars-template"
        destination = "${NOMAD_TASK_DIR}/vars"
      }

      vault {
        policies = ["florence"]

        change_mode   = "signal"
        change_signal = "SIGTERM"
      }
    }
  }
}
