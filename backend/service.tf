provider "google" {
    project = "critter-367017"
}

# Allow anyone to invoke application
data "google_iam_policy" "noauth" {
  binding {
    role = "roles/run.invoker"
    members = ["allUsers"]
  }
}

# data "google_iam_policy" "backend_credentials_access" {
#   binding {
#     role = "roles/secretmanager.secretAccessor"
#     members = ["serviceAccount:${google_service_account.backend_service_account.email}"]
#   }
# }

# Create secret
resource "google_secret_manager_secret" "credentials" {
  secret_id = "critter-credentials"
  replication {
    user_managed {
      replicas {
        location = "europe-west2"
      }
    }
  }
}

# Create service account
resource "google_service_account" "backend_service_account" {
  account_id = "backend-service-account"
  display_name = "Account for Critter Backend"
}

# Allow service account to access secret
resource "google_secret_manager_secret_iam_member" "backend-credentials-access" {
  secret_id = google_secret_manager_secret.credentials.id
  role      = "roles/secretmanager.secretAccessor"
  member    = "serviceAccount:${google_service_account.backend_service_account.email}"
}


# Create containerised application
resource "google_cloud_run_service" "backend" {
  name = "critter-backend"
  location = "europe-west2"
  metadata {
    annotations = {
      "run.googleapis.com/client-name" = "terraform"
    }
  }

  template {
    spec {
      service_account_name = google_service_account.backend_service_account.email
      containers {
        image = "europe-west2-docker.pkg.dev/critter-367017/app/critter"
        env { 
          name = "CREDENTIALS"
          value_from {
            secret_key_ref {
              key = "latest"
              name = google_secret_manager_secret.credentials.secret_id
            }
          }
        }
        ports {
          container_port = 8000
        }
      }
    }
  }

  traffic {
    percent = 100
    latest_revision = true
  }
}


# Attach IAM policy to container
resource "google_cloud_run_service_iam_policy" "noauth" {
  location    = google_cloud_run_service.backend.location
  project     = google_cloud_run_service.backend.project
  service     = google_cloud_run_service.backend.name
  policy_data = data.google_iam_policy.noauth.policy_data
}

