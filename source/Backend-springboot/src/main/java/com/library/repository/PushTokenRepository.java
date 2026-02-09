package com.library.repository;

import com.library.model.PushToken;
import com.library.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PushTokenRepository extends JpaRepository<PushToken, Long> {

    // Find all active tokens for a user
    List<PushToken> findByUserAndIsActiveTrue(User user);

    // Find token by value
    Optional<PushToken> findByToken(String token);

    // Find token by user and token
    Optional<PushToken> findByUserAndToken(User user, String token);

    // Deactivate all tokens for a user
    @Modifying
    @Query("UPDATE PushToken p SET p.isActive = false WHERE p.user = :user")
    void deactivateAllByUser(@Param("user") User user);

    // Delete token by value
    void deleteByToken(String token);

    // Delete all tokens for a user
    void deleteAllByUser(User user);
}
