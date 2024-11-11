create database work;
use work;

drop table if exists `db_email_code`;
create table db_email_code(
	id int auto_increment primary key,
    client_email varchar(50) not null,
    email_code varchar(50) ,
    code_id text
);
select * from db_email_code;