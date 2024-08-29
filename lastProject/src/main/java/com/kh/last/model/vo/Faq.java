package com.kh.last.model.vo;

import java.time.LocalDate;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
@Table(name = "FAQ")
public class Faq {

	@Id
//	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "faq_seq")
	@SequenceGenerator(name = "faq_seq", sequenceName = "faq_seq", allocationSize = 1)
	private Long id;
	
	private LocalDate insertDate;
	
	private String question;
	
	private String answer;
}
