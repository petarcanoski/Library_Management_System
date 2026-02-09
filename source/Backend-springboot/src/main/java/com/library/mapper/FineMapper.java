package com.library.mapper;

import com.library.model.Fine;
import com.library.model.BookLoan;
import com.library.model.User;
import com.library.payload.dto.FineDTO;
import com.library.repository.BookLoanRepository;
import com.library.repository.UserRepository;
import com.library.exception.BookLoanException;
import com.library.exception.UserException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Mapper for converting between Fine entity and FineDTO
 */
@Component
@RequiredArgsConstructor
public class FineMapper {

    private final UserRepository userRepository;
    private final BookLoanRepository bookLoanRepository;

    /**
     * Convert Fine entity to FineDTO
     */
    public FineDTO toDTO(Fine fine) {
        if (fine == null) {
            return null;
        }

        FineDTO dto = new FineDTO();
        dto.setId(fine.getId());

        // Book loan information
        if (fine.getBookLoan() != null) {
            dto.setBookLoanId(fine.getBookLoan().getId());
            if (fine.getBookLoan().getBook() != null) {
                dto.setBookTitle(fine.getBookLoan().getBook().getTitle());
                dto.setBookIsbn(fine.getBookLoan().getBook().getIsbn());
            }
        }

        // User information
        if (fine.getUser() != null) {
            dto.setUserId(fine.getUser().getId());
            dto.setUserName(fine.getUser().getFullName());
            dto.setUserEmail(fine.getUser().getEmail());
        }

        dto.setType(fine.getType());
        dto.setAmount(fine.getAmount());
        dto.setAmountPaid(fine.getAmountPaid());
        dto.setAmountOutstanding(fine.getAmountOutstanding());
        dto.setStatus(fine.getStatus());
        dto.setReason(fine.getReason());
        dto.setNotes(fine.getNotes());

        // Waiver information
        if (fine.getWaivedBy() != null) {
            dto.setWaivedByUserId(fine.getWaivedBy().getId());
            dto.setWaivedByUserName(fine.getWaivedBy().getFullName());
        }
        dto.setWaivedAt(fine.getWaivedAt());
        dto.setWaiverReason(fine.getWaiverReason());

        // Payment information
        dto.setPaidAt(fine.getPaidAt());
        if (fine.getProcessedBy() != null) {
            dto.setProcessedByUserId(fine.getProcessedBy().getId());
            dto.setProcessedByUserName(fine.getProcessedBy().getFullName());
        }
        dto.setTransactionId(fine.getTransactionId());

        dto.setCreatedAt(fine.getCreatedAt());
        dto.setUpdatedAt(fine.getUpdatedAt());

        return dto;
    }

    /**
     * Convert FineDTO to Fine entity (for creating new fines)
     */
    public Fine toEntity(FineDTO dto) throws UserException {
        if (dto == null) {
            return null;
        }

        Fine fine = new Fine();

        // Fetch and set book loan
        if (dto.getBookLoanId() != null) {
            BookLoan bookLoan = bookLoanRepository.findById(dto.getBookLoanId())
                    .orElseThrow(() -> new BookLoanException("Book loan not found with id: " + dto.getBookLoanId()));
            fine.setBookLoan(bookLoan);
        }

        // Fetch and set user
        if (dto.getUserId() != null) {
            User user = userRepository.findById(dto.getUserId())
                    .orElseThrow(() -> new UserException("User not found with id: " + dto.getUserId()));
            fine.setUser(user);
        }

        fine.setType(dto.getType());
        fine.setAmount(dto.getAmount());
        fine.setAmountPaid(dto.getAmountPaid() != null ? dto.getAmountPaid() : 0L);
        fine.setStatus(dto.getStatus() != null ? dto.getStatus() : com.library.domain.FineStatus.PENDING);
        fine.setReason(dto.getReason());
        fine.setNotes(dto.getNotes());
        fine.setTransactionId(dto.getTransactionId());

        return fine;
    }

    /**
     * Convert list of Fine entities to list of FineDTOs
     */
    public List<FineDTO> toDTOList(List<Fine> fines) {
        if (fines == null) {
            return null;
        }
        return fines.stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    /**
     * Update existing Fine entity with values from DTO
     * (for updates, doesn't change relationships)
     */
    public void updateEntityFromDTO(Fine fine, FineDTO dto) {
        if (fine == null || dto == null) {
            return;
        }

        if (dto.getAmount() != null) {
            fine.setAmount(dto.getAmount());
        }
        if (dto.getAmountPaid() != null) {
            fine.setAmountPaid(dto.getAmountPaid());
        }
        if (dto.getStatus() != null) {
            fine.setStatus(dto.getStatus());
        }
        if (dto.getReason() != null) {
            fine.setReason(dto.getReason());
        }
        if (dto.getNotes() != null) {
            fine.setNotes(dto.getNotes());
        }
        if (dto.getTransactionId() != null) {
            fine.setTransactionId(dto.getTransactionId());
        }
    }
}
