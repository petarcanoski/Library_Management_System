package com.library.repository;


import com.library.domain.UserRole;
import com.library.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Set;

public interface UserRepository extends JpaRepository<User, Long> {

    User findByEmail(String email);
    Set<User> findByRole(UserRole role);
}
