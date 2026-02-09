package com.library.service;

import com.library.exception.UserException;
import com.library.model.PushToken;
import com.library.model.User;
import com.library.payload.request.PushTokenRequest;

import java.util.List;

/**
 * Service interface for managing push notification tokens
 */
public interface PushTokenService {

    /**
     * Register a new push notification token for a user
     * @param user The user
     * @param request The push token request
     * @return The created PushToken
     * @throws UserException if token is invalid
     */
    PushToken registerToken(User user, PushTokenRequest request) throws UserException;

    /**
     * Delete a push notification token
     * @param user The user
     * @param token The token to delete
     * @throws UserException if token not found or doesn't belong to user
     */
    void deleteToken(User user, String token) throws UserException;

    /**
     * Get all active push tokens for a user
     * @param user The user
     * @return List of active push tokens
     */
    List<PushToken> getActiveTokens(User user);
}
