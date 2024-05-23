package cz.vut.fit.archiveMaterials.backend.api.domain.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import org.hibernate.search.mapper.pojo.mapping.definition.annotation.Indexed;
import org.hibernate.search.mapper.pojo.mapping.definition.annotation.KeywordField;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.awt.print.Book;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Collection;

@Data
@Entity
@Indexed
@Table(name = "user", indexes = {
        @Index(name = "idx_email", columnList = "email", unique = true),
        @Index(name = "idx_is_verified_and_email", columnList = "email, isVerified", unique = true),
        @Index(name = "idx_verify_hash", columnList = "verify_hash", unique = true),
        @Index(name = "idx_password_reset_hash", columnList = "password_reset_hash", unique = true)
})
public class User implements UserDetails {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    @Column(name = "email", nullable = false)
    @NotBlank
    @Email
    @KeywordField
    private String email;

    @Column(name = "password", nullable = false)
    @NotBlank
    private String password;

    @Column(name = "name")
    private String name;

    private boolean isVerified;

    @Column(name = "verify_hash")
    private String verifyHash;

    @Column(name = "password_reset_hash")
    private String passwordResetHash;


    @Column(name = "last_updated")
    private LocalDateTime lastUpdated;

    @OneToMany(fetch = FetchType.LAZY, mappedBy = "user")
    private Collection<Bookmark> bookmarks;

    @OneToMany(fetch = FetchType.LAZY, mappedBy = "user")
    private Collection<Note> notes;

    @ManyToMany(mappedBy = ArchivalRecord_.FAVOURITES_BY_USERS, fetch = FetchType.EAGER)
    @JsonIgnore
    private Collection<ArchivalRecord> favouriteArchivalRecords = new ArrayList<>();

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return null;
    }
    @Override
    public String getUsername() {
        return this.email;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    //TODO.... probably isVerified should be isEnabled
    @Override
    public boolean isEnabled() {
        return true;
    }

    public boolean isIsVerified() {
        return isVerified;
    }
}
