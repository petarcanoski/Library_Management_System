package com.library.service;

import com.library.exception.SubscriptionPlanException;
import com.library.model.SubscriptionPlan;
import com.library.payload.dto.SubscriptionPlanDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

/**
 * Service interface for subscription plan management
 */
public interface SubscriptionPlanService {

    /**
     * Create new subscription plan (Admin only)
     */
    SubscriptionPlanDTO createPlan(SubscriptionPlanDTO planDTO) throws SubscriptionPlanException;

    /**
     * Update existing subscription plan (Admin only)
     */
    SubscriptionPlanDTO updatePlan(Long planId, SubscriptionPlanDTO planDTO) throws SubscriptionPlanException;

    /**
     * Delete/deactivate subscription plan (Admin only)
     */
    void deletePlan(Long planId) throws SubscriptionPlanException;

    /**
     * Activate subscription plan (Admin only)
     */
    SubscriptionPlanDTO activatePlan(Long planId) throws SubscriptionPlanException;

    /**
     * Deactivate subscription plan (Admin only)
     */
    SubscriptionPlanDTO deactivatePlan(Long planId) throws SubscriptionPlanException;

    /**
     * Get plan by ID
     */
    SubscriptionPlanDTO getPlanById(Long planId) throws SubscriptionPlanException;

    /**
     * Get plan by plan code
     */
    SubscriptionPlan getPlanByCode(String planCode) throws SubscriptionPlanException;

    /**
     * Get all active plans
     */
    List<SubscriptionPlanDTO> getAllActivePlans();

    /**
     * Get all plans with pagination (Admin)
     */
    Page<SubscriptionPlanDTO> getAllPlans(Pageable pageable);

    /**
     * Get all active plans with pagination
     */
    Page<SubscriptionPlanDTO> getAllActivePlans(Pageable pageable);

    /**
     * Get featured plans
     */
    List<SubscriptionPlanDTO> getFeaturedPlans();

    /**
     * Search plans by name or description
     */
    Page<SubscriptionPlanDTO> searchPlans(String searchTerm, Pageable pageable);

    /**
     * Get plans by currency
     */
    List<SubscriptionPlanDTO> getPlansByCurrency(String currency);

    /**
     * Check if plan code exists
     */
    boolean planCodeExists(String planCode);
}
