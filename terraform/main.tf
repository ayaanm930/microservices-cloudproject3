# ECR Repository (for Docker images)
resource "aws_ecr_repository" "app_repo" {
  name                 = "${var.project_name}-repo"
  image_tag_mutability = "MUTABLE"
  force_delete         = true
}

# ECS Cluster (for running containers)
resource "aws_ecs_cluster" "main" {
  name = "${var.project_name}-cluster"
}

module "network" {
  source       = "./modules/network"
  project_name = var.project_name
  aws_region   = var.aws_region
}

module "ecs" {
  source               = "./modules/ecs"
  project_name         = var.project_name
  vpc_id               = module.network.vpc_id
  public_subnets       = module.network.public_subnets
  ecs_security_group_id = module.network.ecs_security_group_id

  container_definitions = [
    {
      name  = "auth-service"
      image = "${aws_ecr_repository.app_repo.repository_url}:auth-service"
      port  = 4000
    },
    {
      name  = "user-service"
      image = "${aws_ecr_repository.app_repo.repository_url}:user-service"
      port  = 5000
    },
    {
      name  = "frontend"
      image = "${aws_ecr_repository.app_repo.repository_url}:frontend"
      port  = 80
    }
  ]
}
