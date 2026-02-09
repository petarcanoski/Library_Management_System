package com.library.mapper;

import com.library.model.SubscriptionPlan;
import com.library.payload.dto.SubscriptionPlanDTO;
import org.springframework.stereotype.Component;

/**
 * Mapper for converting between SubscriptionPlan entity and DTO
 */
@Component
public class SubscriptionPlanMapper {

    /**
     * Convert entity to DTO
     */
    public SubscriptionPlanDTO toDTO(SubscriptionPlan plan) {
        if (plan == null) {
            return null;
        }

        SubscriptionPlanDTO dto = new SubscriptionPlanDTO();
        dto.setId(plan.getId());
        dto.setPlanCode(plan.getPlanCode());
        dto.setName(plan.getName());
        dto.setDescription(plan.getDescription());
        dto.setDurationDays(plan.getDurationDays());
        dto.setPrice(plan.getPrice());
        dto.setCurrency(plan.getCurrency());
        dto.setMaxBooksAllowed(plan.getMaxBooksAllowed());
        dto.setMaxDaysPerBook(plan.getMaxDaysPerBook());
        dto.setDisplayOrder(plan.getDisplayOrder());
        dto.setIsActive(plan.getIsActive());
        dto.setIsFeatured(plan.getIsFeatured());
        dto.setBadgeText(plan.getBadgeText());
        dto.setAdminNotes(plan.getAdminNotes());
        dto.setCreatedAt(plan.getCreatedAt());
        dto.setUpdatedAt(plan.getUpdatedAt());
        dto.setCreatedBy(plan.getCreatedBy());
        dto.setUpdatedBy(plan.getUpdatedBy());

        // Set calculated fields
        dto.setPriceInMajorUnits(plan.getPriceInMajorUnits());
        dto.setMonthlyEquivalentPrice(plan.getMonthlyEquivalentPrice());

        return dto;
    }

    /**
     * Convert DTO to entity
     */
    public SubscriptionPlan toEntity(SubscriptionPlanDTO dto) {
        if (dto == null) {
            return null;
        }

        SubscriptionPlan plan = new SubscriptionPlan();
        plan.setId(dto.getId());
        plan.setPlanCode(dto.getPlanCode());
        plan.setName(dto.getName());
        plan.setDescription(dto.getDescription());
        plan.setDurationDays(dto.getDurationDays());
        plan.setPrice(dto.getPrice());
        plan.setCurrency(dto.getCurrency() != null ? dto.getCurrency() : "INR");
        plan.setMaxBooksAllowed(dto.getMaxBooksAllowed());
        plan.setMaxDaysPerBook(dto.getMaxDaysPerBook());
        plan.setDisplayOrder(dto.getDisplayOrder() != null ? dto.getDisplayOrder() : 0);
        plan.setIsActive(dto.getIsActive() != null ? dto.getIsActive() : true);
        plan.setIsFeatured(dto.getIsFeatured() != null ? dto.getIsFeatured() : false);
        plan.setBadgeText(dto.getBadgeText());
        plan.setAdminNotes(dto.getAdminNotes());
        plan.setCreatedBy(dto.getCreatedBy());
        plan.setUpdatedBy(dto.getUpdatedBy());

        return plan;
    }

    /**
     * Update entity from DTO (for update operations)
     */
    public void updateEntity(SubscriptionPlan plan, SubscriptionPlanDTO dto) {
        if (plan == null || dto == null) {
            return;
        }

        // Don't update ID or planCode (immutable after creation)
        if (dto.getName() != null) {
            plan.setName(dto.getName());
        }
        if (dto.getDescription() != null) {
            plan.setDescription(dto.getDescription());
        }
        if (dto.getDurationDays() != null) {
            plan.setDurationDays(dto.getDurationDays());
        }
        if (dto.getPrice() != null) {
            plan.setPrice(dto.getPrice());
        }
        if (dto.getCurrency() != null) {
            plan.setCurrency(dto.getCurrency());
        }
        if (dto.getMaxBooksAllowed() != null) {
            plan.setMaxBooksAllowed(dto.getMaxBooksAllowed());
        }
        if (dto.getMaxDaysPerBook() != null) {
            plan.setMaxDaysPerBook(dto.getMaxDaysPerBook());
        }
        if (dto.getDisplayOrder() != null) {
            plan.setDisplayOrder(dto.getDisplayOrder());
        }
        if (dto.getIsActive() != null) {
            plan.setIsActive(dto.getIsActive());
        }
        if (dto.getIsFeatured() != null) {
            plan.setIsFeatured(dto.getIsFeatured());
        }
        if (dto.getBadgeText() != null) {
            plan.setBadgeText(dto.getBadgeText());
        }
        if (dto.getAdminNotes() != null) {
            plan.setAdminNotes(dto.getAdminNotes());
        }
        if (dto.getUpdatedBy() != null) {
            plan.setUpdatedBy(dto.getUpdatedBy());
        }
    }
}
