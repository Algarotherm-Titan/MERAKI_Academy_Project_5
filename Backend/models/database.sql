CREATE TABLE roles (
    id SERIAL NOT NULL,
    role VARCHAR(255) NOT NULL,
    PRIMARY KEY (id)
)

CREATE TABLE users (
    id serial PRIMARY KEY,
    username  VARCHAR(255),
    password  VARCHAR(255), 
    email VARCHAR(255) UNIQUE,
    image  VARCHAR(255), 
    role_id integer REFERENCES roles(id),
    crypto_amount numeric DEFAULT 2000,
    created_at TIMESTAMP
);

CREATE TABLE friend_list (
    id serial PRIMARY KEY,
    user_id integer REFERENCES users(id),
    friend_user_id integer REFERENCES users(id),
    status varchar,
    created_at TIMESTAMP
);

CREATE TABLE posts (
    post_id serial PRIMARY KEY,
    user_id integer REFERENCES users(id),
    title varchar,
    content text,
    image_url varchar,
    created_at TIMESTAMP DEFAULT NOW(),
    is_deleted SMALLINT DEFAULT 0
);

CREATE TABLE comments (
    comment_id serial PRIMARY KEY,
    user_id integer REFERENCES users(id),
    post_id integer REFERENCES posts(post_id),
    content text,
    created_at TIMESTAMP DEFAULT NOW(),
    is_deleted SMALLINT DEFAULT 0

);

CREATE TABLE likes (
    like_id serial PRIMARY KEY,
    user_id integer REFERENCES users(id),
    post_id integer REFERENCES posts(post_id),
    is_deleted SMALLINT DEFAULT 0
);

CREATE TABLE notification (
  id serial PRIMARY KEY,
  sender_id integer REFERENCES users(id),
  receiver_id integer REFERENCES users(id),
  comment_id integer REFERENCES comments(comment_id),
  like_id integer REFERENCES likes(like_id),
  friend_request integer REFERENCES friend_list(id),
  created_at TIMESTAMP DEFAULT NOW(),
  is_deleted SMALLINT DEFAULT 0
);






CREATE TABLE "role" (
  "id" serial PRIMARY KEY,
  "role_name" varchar
);

CREATE TABLE "permission" (
  "id" serial PRIMARY KEY,
  "permission" varchar
);




CREATE TABLE "role_permission" (
  "id" SERIAL PRIMARY KEY,
  "role_id" integer,
  "permission_id" integer
);
ALTER TABLE role_permission
ADD FOREIGN KEY (role_id) REFERENCES role (id);

ALTER TABLE role_permission
ADD FOREIGN KEY (permission_id) REFERENCES permission (id);
