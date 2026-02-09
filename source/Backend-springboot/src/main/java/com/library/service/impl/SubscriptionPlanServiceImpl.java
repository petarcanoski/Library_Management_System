package com.library.service.impl;

import com.library.exception.SubscriptionPlanException;
import com.library.mapper.SubscriptionPlanMapper;
import com.library.model.SubscriptionPlan;
import com.library.payload.dto.SubscriptionPlanDTO;
import com.library.repository.SubscriptionPlanRepository;
import com.library.service.SubscriptionPlanService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Implementation of SubscriptionPlanService
 */
@Service
@Transactional
@RequiredArgsConstructor
@Slf4j
public class SubscriptionPlanServiceImpl implements SubscriptionPlanService {

    private final SubscriptionPlanRepository planRepository;
    private final SubscriptionPlanMapper planMapper;

    @Override
    public SubscriptionPlanDTO createPlan(SubscriptionPlanDTO planDTO) throws SubscriptionPlanException {
        log.info("Creating new subscription plan: {}", planDTO.getPlanCode());

        // Validate plan code uniqueness
        if (planRepository.existsByPlanCode(planDTO.getPlanCode())) {
            throw new SubscriptionPlanException("Plan code already exists: " + planDTO.getPlanCode());
        }

        // Validate price is in smallest currency unit (paise/cents)
        if (planDTO.getPrice() < 100) {
            throw new SubscriptionPlanException("Price must be at least 100 (smallest currency units)");
        }

        SubscriptionPlan plan = planMapper.toEntity(planDTO);

        // Set audit fields
        String currentUser = getCurrentUserEmail();
        plan.setCreatedBy(currentUser);
        plan.setUpdatedBy(currentUser);

        plan = planRepository.save(plan);
        log.info("Subscription plan created successfully with ID: {}", plan.getId());

        return planMapper.toDTO(plan);
    }

    @Override
    public SubscriptionPlanDTO updatePlan(Long planId, SubscriptionPlanDTO planDTO) throws SubscriptionPlanException {
        log.info("Updating subscription plan ID: {}", planId);

        SubscriptionPlan existingPlan = planRepository.findById(planId)
            .orElseThrow(() -> new SubscriptionPlanException("Subscription plan not found with ID: " + planId));

        // Don't allow changing plan code
        if (planDTO.getPlanCode() != null && !planDTO.getPlanCode().equals(existingPlan.getPlanCode())) {
            throw new SubscriptionPlanException("Plan code cannot be changed after creation");
        }

        // Validate price if being updated
        if (planDTO.getPrice() != null && planDTO.getPrice() < 100) {
            throw new SubscriptionPlanException("Price must be at least 100 (smallest currency units)");
        }

        // Update fields
        planMapper.updateEntity(existingPlan, planDTO);

        // Update audit field
        existingPlan.setUpdatedBy(getCurrentUserEmail());

        existingPlan = planRepository.save(existingPlan);
        log.info("Subscription plan updated successfully: {}", planId);

        return planMapper.toDTO(existingPlan);
    }

    @Override
    public void deletePlan(Long planId) throws SubscriptionPlanException {
        log.info("Deleting subscription plan ID: {}", planId);

        SubscriptionPlan plan = planRepository.findById(planId)
            .orElseThrow(() -> new SubscriptionPlanException("Subscription plan not found with ID: " + planId));

        // Soft delete - just deactivate instead of hard delete
        plan.setIsActive(false);
        plan.setUpdatedBy(getCurrentUserEmail());
        planRepository.save(plan);

        log.info("Subscription plan deactivated: {}", planId);
    }

    @Override
    public SubscriptionPlanDTO activatePlan(Long planId) throws SubscriptionPlanException {
        log.info("Activating subscription plan ID: {}", planId);

        SubscriptionPlan plan = planRepository.findById(planId)
            .orElseThrow(() -> new SubscriptionPlanException("Subscription plan not found with ID: " + planId));

        plan.setIsActive(true);
        plan.setUpdatedBy(getCurrentUserEmail());
        plan = planRepository.save(plan);

        log.info("Subscription plan activated: {}", planId);
        return planMapper.toDTO(plan);
    }

    @Override
    public SubscriptionPlanDTO deactivatePlan(Long planId) throws SubscriptionPlanException {
        log.info("Deactivating subscription plan ID: {}", planId);

        SubscriptionPlan plan = planRepository.findById(planId)
            .orElseThrow(() -> new SubscriptionPlanException("Subscription plan not found with ID: " + planId));

        plan.setIsActive(false);
        plan.setUpdatedBy(getCurrentUserEmail());
        plan = planRepository.save(plan);

        log.info("Subscription plan deactivated: {}", planId);
        return planMapper.toDTO(plan);
    }

    @Override
    public SubscriptionPlanDTO getPlanById(Long planId) throws SubscriptionPlanException {
        SubscriptionPlan plan = planRepository.findById(planId)
            .orElseThrow(() -> new SubscriptionPlanException("Subscription plan not found with ID: " + planId));

        return planMapper.toDTO(plan);
    }

    @Override
    public SubscriptionPlan getPlanByCode(String planCode) throws SubscriptionPlanException {
        SubscriptionPlan plan = planRepository.findByPlanCode(planCode)
            .orElseThrow(() -> new SubscriptionPlanException("Subscription plan not found with code: " + planCode));

        return plan;
    }

    @Override
    public List<SubscriptionPlanDTO> getAllActivePlans() {
        List<SubscriptionPlan> plans = planRepository.findAllActivePlans();
        return plans.stream()
            .map(planMapper::toDTO)
            .collect(Collectors.toList());
    }

    @Override
    public Page<SubscriptionPlanDTO> getAllPlans(Pageable pageable) {
        Page<SubscriptionPlan> plans = planRepository.findAllPlansOrdered(pageable);
        return plans.map(planMapper::toDTO);
    }

    @Override
    public Page<SubscriptionPlanDTO> getAllActivePlans(Pageable pageable) {
        Page<SubscriptionPlan> plans = planRepository.findAllActivePlans(pageable);
        return plans.map(planMapper::toDTO);
    }

    @Override
    public List<SubscriptionPlanDTO> getFeaturedPlans() {
        List<SubscriptionPlan> plans = planRepository.findFeaturedPlans();
        return plans.stream()
            .map(planMapper::toDTO)
            .collect(Collectors.toList());
    }

    @Override
    public Page<SubscriptionPlanDTO> searchPlans(String searchTerm, Pageable pageable) {
        Page<SubscriptionPlan> plans = planRepository.searchPlans(searchTerm, pageable);
        return plans.map(planMapper::toDTO);
    }

    @Override
    public List<SubscriptionPlanDTO> getPlansByCurrency(String currency) {
        List<SubscriptionPlan> plans = planRepository.findActivePlansByCurrency(currency);
        return plans.stream()
            .map(planMapper::toDTO)
            .collect(Collectors.toList());
    }

    @Override
    public boolean planCodeExists(String planCode) {
        return planRepository.existsByPlanCode(planCode);
    }

    /**
     * Get currently authenticated user email for audit
     */
    private String getCurrentUserEmail() {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            if (authentication != null && authentication.isAuthenticated()) {
                return authentication.getName();
            }
        } catch (Exception e) {
            log.warn("Could not get authenticated user", e);
        }
        return "system";
    }
}
