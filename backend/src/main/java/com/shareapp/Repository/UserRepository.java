package com.shareapp.Repository;

import com.shareapp.Model.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, Long> {

    User findByUsername(String username);

    User findByEmail(String email);

    //TODO create SQL queries for more complex data operations if needed

}
