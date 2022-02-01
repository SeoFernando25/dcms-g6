-- SQL Function that registers a user using the given username and password
create or replace function reg(u_name varchar(50), u_pass varchar(50))
returns boolean
language plpgsql
as 
$$
declare
    user_id int;
begin
    select id into user_id from users where username = u_name;
    if user_id is null then
        insert into users (username, password) values (u_name, u_pass);
        return true;
    else
        return false;
    end if;
end;
$$;

-- Call the function
select reg('test', 'test');



-- SQL function called "logout" that takes a session token and deletes it from the sessions table
create or replace function logout(sess_token uuid)
returns void
language plpgsql
as
$$
declare
    p_id int;
begin
    select person_id into p_id from public.session where token = sess_token;
    if p_id is not null then
        delete from public.session where person_id = p_id;
    end if;
end;
$$;