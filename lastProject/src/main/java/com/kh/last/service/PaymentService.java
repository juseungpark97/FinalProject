package com.kh.last.service;

import com.paypal.api.payments.*;
import com.paypal.base.rest.APIContext;
import com.paypal.base.rest.PayPalRESTException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.HashMap;
import java.util.Map;

@Service
public class PaymentService {

	@Autowired
	private APIContext apiContext;

	public Map<String, String> createPayment(Double total, String currency, String method, String intent,
			String description, String cancelUrl, String successUrl) throws PayPalRESTException {
		Amount amount = new Amount();
		amount.setCurrency(currency);
		amount.setTotal(String.format("%.2f", total));

		Transaction transaction = new Transaction();
		transaction.setDescription(description);
		transaction.setAmount(amount);

		List<Transaction> transactions = new ArrayList<>();
		transactions.add(transaction);

		Payer payer = new Payer();
		payer.setPaymentMethod(method.toString());

		Payment payment = new Payment();
		payment.setIntent(intent);
		payment.setPayer(payer);
		payment.setTransactions(transactions);

		RedirectUrls redirectUrls = new RedirectUrls();
		redirectUrls.setCancelUrl(cancelUrl);
		redirectUrls.setReturnUrl(successUrl);
		payment.setRedirectUrls(redirectUrls);

		Payment createdPayment = payment.create(apiContext);

		Map<String, String> response = new HashMap<>();
		for (Links link : createdPayment.getLinks()) {
			if (link.getRel().equals("approval_url")) {
				response.put("redirectUrl", link.getHref());
				break;
			}
		}
		return response;
	}

	public Payment executePayment(String paymentId, String payerId) throws PayPalRESTException {
		Payment payment = new Payment();
		payment.setId(paymentId);
		PaymentExecution paymentExecution = new PaymentExecution();
		paymentExecution.setPayerId(payerId);
		return payment.execute(apiContext, paymentExecution);
	}

	public String getMaskedCardInfo(String cardNumber) {
		if (cardNumber == null || cardNumber.length() < 16) {
			throw new IllegalArgumentException("Invalid card number");
		}
		return "**** **** **** " + cardNumber.substring(cardNumber.length() - 4);
	}
}