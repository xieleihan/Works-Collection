create database work;
use work;

drop table if exists `userinfo`;
create table userinfo(
	id int auto_increment primary key,
    username varchar(100) not null,
	useremail varchar(100) not null,
    userpassword varchar(100) not null,
    useraddress varchar(100),
    useravater text
);
select * from userinfo;

drop table if exists `superadmin`;
create table superadmin(
	id int auto_increment primary key,
    username varchar(100) not null,
    email varchar(100) not null,
    password varchar(100) not null
);
select * from superadmin;

drop table if exists `db_email_code`;
create table db_email_code(
	id int auto_increment primary key,
    client_email varchar(50) not null,
    email_code varchar(50) ,
    code_id text
);
select * from db_email_code;

drop table if exists `db_verifyImage_code`;
create table db_verifyImage_code(
	id int auto_increment primary key,
    verifyImage_code varchar(50) not null,
    client_email varchar(50) not null,
    code_id text
);
select * from db_verifyImage_code;

drop table if exists `db_message_board`;
create table db_message_board(
	id int auto_increment primary key,
    email varchar(50) not null,
    message text,
    username varchar(100),
    avater text,
    datestr text
);
select * from db_message_board;
INSERT INTO db_message_board (email, message, username, avater, datestr) VALUES ('xieleihan@gmail.com', '这是测试信息1', '南秋SouthAki', '/img/1.png', '2024-10-20 10:00:00');
INSERT INTO db_message_board (email, message, username, avater, datestr) VALUES ('xieleihan@gmail.com', '这是测试信息2', '南秋SouthAki', '/img/2.png', '2024-10-20 10:00:00');
INSERT INTO db_message_board (email, message, username, avater, datestr) VALUES ('xieleihan@gmail.com', '这是测试信息3', '南秋SouthAki', '/img/3.png', '2024-10-20 10:00:00');
INSERT INTO db_message_board (email, message, username, avater, datestr) VALUES ('xieleihan@gmail.com', '这是测试信息4', '南秋SouthAki', '/img/4.png', '2024-10-20 10:00:00');