package com.library.payload.dto;

import com.library.domain.DeliveryMethod;
import com.library.domain.NotificationType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class NotificationDTO {
    private Long id;
    private Long userId;
    private String title;
    private String message;
    private NotificationType type;
    private Boolean isRead;
    private LocalDateTime createdAt;
    private Long relatedEntityId;
    private DeliveryMethod deliveryMethod;
    private LocalDateTime readAt;
}
