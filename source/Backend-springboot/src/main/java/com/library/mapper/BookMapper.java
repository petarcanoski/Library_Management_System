package com.library.mapper;

import com.library.exception.BookException;
import com.library.model.Book;
import com.library.model.Genre;
import com.library.payload.dto.BookDTO;
import com.library.repository.BookLoanRepository;
import com.library.repository.GenreRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

/**
 * Mapper for converting between Book entity and BookDTO
 */
@Component
@RequiredArgsConstructor
public class BookMapper {

    private final GenreRepository genreRepository;
    private final BookLoanRepository bookLoanRepository;

    /**
     * Convert Book entity to BookDTO
     */
    public BookDTO toDTO(Book book) {
        if (book == null) {
            return null;
        }

        BookDTO dto = new BookDTO();
        dto.setId(book.getId());
        dto.setIsbn(book.getIsbn());
        dto.setTitle(book.getTitle());
        dto.setAuthor(book.getAuthor());

        // Map genre information
        if (book.getGenre() != null) {
            dto.setGenreId(book.getGenre().getId());
            dto.setGenreName(book.getGenre().getName());
            dto.setGenreCode(book.getGenre().getCode());
        }

        dto.setPublisher(book.getPublisher());
        dto.setPublicationDate(book.getPublicationDate());
        dto.setLanguage(book.getLanguage());
        dto.setPages(book.getPages());
        dto.setDescription(book.getDescription());
        dto.setTotalCopies(book.getTotalCopies());
        dto.setAvailableCopies(book.getAvailableCopies());
        dto.setPrice(book.getPrice());
        dto.setCoverImageUrl(book.getCoverImageUrl());
        dto.setActive(book.getActive());
        dto.setCreatedAt(book.getCreatedAt());
        dto.setUpdatedAt(book.getUpdatedAt());

        return dto;
    }

    /**
     * Convert BookDTO to Book entity
     */
    public Book toEntity(BookDTO dto) throws BookException {
        if (dto == null) {
            return null;
        }

        Book book = new Book();
        book.setId(dto.getId());
        book.setIsbn(dto.getIsbn());
        book.setTitle(dto.getTitle());
        book.setAuthor(dto.getAuthor());

        // Map genre - fetch from database using genreId
        if (dto.getGenreId() != null) {
            Genre genre = genreRepository.findById(dto.getGenreId())
                .orElseThrow(() -> new BookException("Genre with ID " + dto.getGenreId() + " not found"));
            book.setGenre(genre);
        }

        book.setPublisher(dto.getPublisher());
        book.setPublicationDate(dto.getPublicationDate());
        book.setLanguage(dto.getLanguage());
        book.setPages(dto.getPages());
        book.setDescription(dto.getDescription());
        book.setTotalCopies(dto.getTotalCopies());
        book.setAvailableCopies(dto.getAvailableCopies());
        book.setPrice(dto.getPrice());
        book.setCoverImageUrl(dto.getCoverImageUrl());
        book.setActive(true); // Default to active


        return book;
    }

    /**
     * Update existing Book entity with data from BookDTO (for update operations)
     */
    public void updateEntityFromDTO(BookDTO dto, Book book) throws BookException {
        if (dto == null || book == null) {
            return;
        }

        // ISBN should not be updated
        book.setTitle(dto.getTitle());
        book.setAuthor(dto.getAuthor());

        // Update genre if provided
        if (dto.getGenreId() != null) {
            Genre genre = genreRepository.findById(dto.getGenreId())
                .orElseThrow(() -> new BookException("Genre with ID " + dto.getGenreId() + " not found"));
            book.setGenre(genre);
        }

        book.setPublisher(dto.getPublisher());
        book.setPublicationDate(dto.getPublicationDate());
        book.setLanguage(dto.getLanguage());
        book.setPages(dto.getPages());
        book.setDescription(dto.getDescription());
        book.setTotalCopies(dto.getTotalCopies());
        book.setAvailableCopies(dto.getAvailableCopies());
        book.setPrice(dto.getPrice());
        book.setCoverImageUrl(dto.getCoverImageUrl());

        if (dto.getActive() != null) {
            book.setActive(dto.getActive());
        }
    }
}
