create table item (
  id int unsigned primary key auto_increment not null,
  title varchar(255) not null
);

CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  prenom VARCHAR(100) NOT NULL,
  nom VARCHAR(100) NOT NULL,
  telephone VARCHAR(20) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  mot_de_passe VARCHAR(255) NOT NULL,
  entreprise VARCHAR(150) NOT NULL,
  pays VARCHAR(100) NOT NULL,
  adresse VARCHAR(255) NOT NULL,
  ville VARCHAR(100) NOT NULL,
  code_postal VARCHAR(20) NOT NULL,
  role ENUM('admin', 'dirigeant', 'responsable', 'employé') DEFAULT 'employé',
  reset_token VARCHAR(255),
  reset_token_expire DATETIME,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);


