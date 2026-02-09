package com.library.service.impl;

import com.library.exception.UserException;
import com.library.model.PushToken;
import com.library.model.User;
import com.library.payload.request.PushTokenRequest;
import com.library.repository.PushTokenRepository;
import com.library.service.PushTokenService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

/**
 * Implementation of PushTokenService interface.
 * Handles management of push notification tokens for users.
 */
@Service
@Transactional
@RequiredArgsConstructor
@Slf4j
public class PushTokenServiceImpl implements PushTokenService {

    private final PushTokenRepository pushTokenRepository;

    @Override
    public PushToken registerToken(User user, PushTokenRequest request) throws UserException {
        log.info("Registering push token for user: {}", user.getEmail());

        if (request.getToken() == null || request.getToken().trim().isEmpty()) {
            throw new UserException("Push token cannot be null or empty");
        }

        // Check if token already exists
        return pushTokenRepository.findByToken(request.getToken())
                .map(existingToken -> {
                    // Token exists - update it
                    if (!existingToken.getUser().getId().equals(user.getId())) {
                        log.warn("Token {} is being reassigned from user {} to user {}",
                                request.getToken(), existingToken.getUser().getEmail(), user.getEmail());
                        existingToken.setUser(user);
                    }
                    existingToken.setIsActive(true);
                    existingToken.setLastUsedAt(LocalDateTime.now());
                    if (request.getPlatform() != null) {
                        existingToken.setPlatform(request.getPlatform());
                    }
                    PushToken updated = pushTokenRepository.save(existingToken);
                    log.info("Updated existing push token for user: {}", user.getEmail());
                    return updated;
                })
                .orElseGet(() -> {
                    // Token doesn't exist - create new
                    PushToken newToken = PushToken.builder()
                            .user(user)
                            .token(request.getToken())
                            .platform(request.getPlatform())
                            .isActive(true)
                            .lastUsedAt(LocalDateTime.now())
                            .build();
                    PushToken saved = pushTokenRepository.save(newToken);
                    log.info("Created new push token for user: {}", user.getEmail());
                    return saved;
                });
    }

    @Override
    public void deleteToken(User user, String token) throws UserException {
        log.info("Deleting push token for user: {}", user.getEmail());

        PushToken pushToken = pushTokenRepository.findByUserAndToken(user, token)
                .orElseThrow(() -> new UserException("Push token not found or doesn't belong to user"));

        pushTokenRepository.delete(pushToken);
        log.info("Successfully deleted push token for user: {}", user.getEmail());
    }

    @Override
    public List<PushToken> getActiveTokens(User user) {
        log.debug("Fetching active push tokens for user: {}", user.getEmail());
        return pushTokenRepository.findByUserAndIsActiveTrue(user);
    }
}
