-- --------------------------------------------------------
-- Servidor:                     127.0.0.1
-- Versão do servidor:           10.4.32-MariaDB - mariadb.org binary distribution
-- OS do Servidor:               Win64
-- HeidiSQL Versão:              12.21.0.7344
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


-- Copiando estrutura do banco de dados para whatsapp
CREATE DATABASE IF NOT EXISTS `whatsapp` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci */;
USE `whatsapp`;

-- Copiando estrutura para tabela whatsapp.mensagens
CREATE TABLE IF NOT EXISTS `mensagens` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `telefone_remetente` varchar(20) NOT NULL,
  `telefone_destino` varchar(20) NOT NULL,
  `mensagem` text NOT NULL,
  `data_envio` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `telefone_remetente` (`telefone_remetente`),
  KEY `telefone_destino` (`telefone_destino`),
  CONSTRAINT `fk_mensagem_destino` FOREIGN KEY (`telefone_destino`) REFERENCES `utilizadores` (`telefone`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk_mensagem_remetente` FOREIGN KEY (`telefone_remetente`) REFERENCES `utilizadores` (`telefone`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Copiando dados para a tabela whatsapp.mensagens: ~15 rows (aproximadamente)
INSERT INTO `mensagens` (`id`, `telefone_remetente`, `telefone_destino`, `mensagem`, `data_envio`) VALUES
	(4, '11999999999', '11888888888', 'Olá João! Testando a API.', '2026-10-14 12:16:43'),
	(5, '18997370958', '11999999999', 'KK', '2026-10-14 14:23:30'),
	(6, '18997370958', '11999999999', 'Sua tia', '2026-10-14 14:24:13'),
	(7, '11999999999', '18997370958', 'asdasassd', '2026-10-14 14:24:57'),
	(8, '18997370958', '11999999999', 'Oi', '2026-10-14 16:18:49'),
	(9, '18997370958', '11888888888', 'AA', '2026-10-14 16:19:21'),
	(10, '11999999999', '11888888888', 'Olá! Esta é uma mensagem de teste.', '2026-10-14 16:50:55'),
	(12, '11999999999', '11888888888', 'oiiii', '2026-10-14 18:06:03'),
	(13, '11999999999', '11888888888', 'eu te desafio a sair de um nerd fofo', '2026-10-14 18:06:11'),
	(14, '11999999999', '11888888888', 'para um..', '2026-10-14 18:06:14'),
	(15, '11999999999', '11888888888', 'homao', '2026-10-14 18:06:16'),
	(16, '11999999999', '11888888888', 'AAA', '2026-10-14 18:08:40'),
	(17, '18992014554', '18996767677', 'Oi rs.', '2026-10-14 18:20:36'),
	(18, '18992014554', '11999999999', 'Oi filhão', '2026-10-14 18:20:41'),
	(19, '18996799999', '11999999999', 'AA', '2026-10-14 18:56:45'),
	(20, '18996799999', '1234567891', 'Ai ai', '2026-10-14 18:56:54');

-- Copiando estrutura para procedure whatsapp.sp_enviar_mensagem
DELIMITER //
CREATE PROCEDURE `sp_enviar_mensagem`(
	IN p_remetente VARCHAR(20),
	IN p_destino VARCHAR(20),
	IN p_mensagem TEXT
)
BEGIN
	INSERT INTO mensagens (telefone_remetente, telefone_Destino, mensagem)
	VALUES (p_remetente, p_destino, p_mensagem);
END//
DELIMITER ;

-- Copiando estrutura para procedure whatsapp.sp_registrar_utilizador
DELIMITER //
CREATE PROCEDURE `sp_registrar_utilizador`(
	IN p_apelido VARCHAR(100),
	IN p_telefone VARCHAR(20),
	IN p_senha VARCHAR(255)
)
BEGIN 
	INSERT INTO utilizadores(apelido, telefone, senha)
	VALUES (p_apelido, p_telefone, p_senha);
END//
DELIMITER ;

-- Copiando estrutura para tabela whatsapp.utilizadores
CREATE TABLE IF NOT EXISTS `utilizadores` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `apelido` varchar(100) NOT NULL DEFAULT '',
  `telefone` varchar(20) NOT NULL DEFAULT '',
  `senha` varchar(255) NOT NULL,
  `criado_em` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `telefone` (`telefone`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Copiando dados para a tabela whatsapp.utilizadores: ~6 rows (aproximadamente)
INSERT INTO `utilizadores` (`id`, `apelido`, `telefone`, `senha`, `criado_em`) VALUES
	(1, 'Reuel', '11999999999', 'aA1234567890@@_SlaSoVai', '2026-10-14 18:15:02'),
	(2, 'Joao', '11888888888', '654321', '2026-10-14 12:16:03'),
	(3, 'Rafael Parras', '18996799999', '676767', '2026-10-14 13:51:52'),
	(4, 'Igor Rafael Silva de Souza', '18997370958', '05122009', '2026-10-14 13:53:52'),
	(5, 'Emanuel', '1234567891', 'aaaaura24567', '2026-10-14 18:16:00'),
	(6, 'Luciano', '18992014554', '14092008', '2026-10-14 18:18:25'),
	(7, 'Ana Claúdia', '18996767677', '14092008', '2026-10-14 18:20:00');

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
