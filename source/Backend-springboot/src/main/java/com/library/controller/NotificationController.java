package com.library.controller;

import com.library.exception.UserException;
import com.library.model.User;
import com.library.payload.dto.NotificationDTO;
import com.library.payload.request.PushTokenRequest;
import com.library.payload.response.ApiResponse;
import com.library.service.NotificationService;
import com.library.service.PushTokenService;
import com.library.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

/**
 * REST Controller for User Notifications
 *
 * Endpoints:
 * - GET    /api/notifications          → List user notifications (paged)
 * - GET    /api/notifications/unread   → List unread notifications
 * - GET    /api/notifications/count    → Get unread notification count
 * - PUT    /api/notifications/{id}/read → Mark notification as read
 * - PUT    /api/notifications/read-all  → Mark all as read
 * - DELETE /api/notifications/{id}      → Delete notification
 * - DELETE /api/notifications/all       → Delete all notifications
 * - POST   /api/notifications/push-token → Register push notification token
 * - DELETE /api/notifications/push-token → Delete push notification token
 */
@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
public class NotificationController {

    private final NotificationService notificationService;
    private final PushTokenService pushTokenService;
    private final UserService userService;

    /**
     * Get user notifications (paginated)
     * GET /api/notifications?page=0&size=20
     */
    @GetMapping
    public ResponseEntity<Page<NotificationDTO>> getUserNotifications(
            @RequestHeader("Authorization") String jwt,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) throws UserException {

        User user = userService.getUserFromJwtToken(jwt);

        Page<NotificationDTO> notifications = notificationService
                .getUserNotifications(user, page,size);

        return ResponseEntity.ok(notifications);
    }

    /**
     * Get unread notifications (paginated)
     * GET /api/notifications/unread?page=0&size=20
     */
//    @GetMapping("/unread")
//    public ResponseEntity<Page<NotificationDTO>> getUnreadNotifications(
//            @RequestHeader("Authorization") String jwt,
//            @RequestParam(defaultValue = "0") int page,
//            @RequestParam(defaultValue = "20") int size) throws UserException {
//
//        User user = userService.getUserFromJwtToken(jwt);
//        Pageable pageable = PageRequest.of(page, size);
//        Page<NotificationDTO> notifications = notificationService.getUnreadNotifications(user, pageable);
//
//        return ResponseEntity.ok(notifications);
//    }

    /**
     * Get count of unread notifications
     * GET /api/notifications/count
     */
    @GetMapping("/count")
    public ResponseEntity<Map<String, Long>> getUnreadCount(
            @RequestHeader("Authorization") String jwt) throws UserException {

        User user = userService.getUserFromJwtToken(jwt);
        Long count = notificationService.getUnreadCount(user);

        Map<String, Long> response = new HashMap<>();
        response.put("unreadCount", count);

        return ResponseEntity.ok(response);
    }

    /**
     * Mark notification as read
     * PUT /api/notifications/{id}/read
     */
    @PutMapping("/{id}/read")
    public ResponseEntity<NotificationDTO> markAsRead(
            @RequestHeader("Authorization") String jwt,
            @PathVariable Long id) throws UserException {

        User user = userService.getUserFromJwtToken(jwt);
        NotificationDTO notification = notificationService.markAsRead(id, user);

        return ResponseEntity.ok(notification);
    }

    /**
     * Mark all notifications as read
     * PUT /api/notifications/read-all
     */
    @PutMapping("/read-all")
    public ResponseEntity<ApiResponse> markAllAsRead(
            @RequestHeader("Authorization") String jwt) throws UserException {

        User user = userService.getUserFromJwtToken(jwt);
        notificationService.markAllAsRead(user);

        return ResponseEntity.ok(new ApiResponse("All notifications marked as read", true));
    }

    /**
     * Delete a notification
     * DELETE /api/notifications/{id}
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse> deleteNotification(
            @RequestHeader("Authorization") String jwt,
            @PathVariable Long id) throws UserException {

        User user = userService.getUserFromJwtToken(jwt);
        notificationService.deleteNotification(id, user);

        return ResponseEntity.ok(new ApiResponse("Notification deleted successfully", true));
    }

    /**
     * Delete all notifications
     * DELETE /api/notifications/all
     */
    @DeleteMapping("/all")
    public ResponseEntity<ApiResponse> deleteAllNotifications(
            @RequestHeader("Authorization") String jwt) throws UserException {

        User user = userService.getUserFromJwtToken(jwt);
        notificationService.deleteAllNotifications(user);

        return ResponseEntity.ok(new ApiResponse("All notifications deleted successfully", true));
    }

    /**
     * Register push notification token
     * POST /api/notifications/push-token
     */
    @PostMapping("/push-token")
    public ResponseEntity<ApiResponse> registerPushToken(
            @RequestHeader("Authorization") String jwt,
            @Valid @RequestBody PushTokenRequest request) throws UserException {

        User user = userService.getUserFromJwtToken(jwt);
        pushTokenService.registerToken(user, request);

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(new ApiResponse("Push token registered successfully", true));
    }

    /**
     * Delete push notification token
     * DELETE /api/notifications/push-token
     */
    @DeleteMapping("/push-token")
    public ResponseEntity<ApiResponse> deletePushToken(
            @RequestHeader("Authorization") String jwt,
            @RequestBody Map<String, String> request) throws UserException {

        User user = userService.getUserFromJwtToken(jwt);
        String token = request.get("token");

        if (token == null || token.isEmpty()) {
            throw new UserException("Token is required");
        }

        pushTokenService.deleteToken(user, token);

        return ResponseEntity.ok(new ApiResponse("Push token deleted successfully", true));
    }
}
