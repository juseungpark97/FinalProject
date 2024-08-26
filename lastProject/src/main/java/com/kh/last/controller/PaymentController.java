// PaymentController.java

package com.kh.last.controller;

import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.kh.last.service.PaymentService;
import com.paypal.api.payments.Payment;
import com.paypal.base.rest.PayPalRESTException;

@RestController
@RequestMapping("/paypal")
public class PaymentController {

	@Autowired
	private PaymentService paymentService;

	@PostMapping("/pay")
	public ResponseEntity<Map<String, String>> pay(@RequestParam("sum") double sum) {
		try {
			Map<String, String> paymentResponse = paymentService.createPayment(sum, "USD", "paypal", "sale",
					"Payment description", "http://localhost:8088/paypal/cancel",
					"http://localhost:8088/paypal/success");
			return ResponseEntity.ok(paymentResponse);
		} catch (PayPalRESTException e) {
			e.printStackTrace();
			return ResponseEntity.status(500).body(Map.of("error", "Payment failed"));
		}
	}

	@GetMapping("/success")
	public ResponseEntity<Void> successPay(@RequestParam("paymentId") String paymentId,
			@RequestParam("PayerID") String payerId) {
		try {
			Payment payment = paymentService.executePayment(paymentId, payerId);
			if (payment.getState().equals("approved")) {

				return ResponseEntity.status(302).header("Location", "http://localhost:3000/subscribe/success").build();
			}
		} catch (PayPalRESTException e) {
			e.printStackTrace();
		}
		return ResponseEntity.status(500).body(null);
	}

	@GetMapping("/cancel")
	public ResponseEntity<String> cancelPay() {
		return ResponseEntity.ok("Payment cancelled");
	}

	@GetMapping("/payment-info")
	public ResponseEntity<Map<String, String>> getPaymentInfo(@RequestParam("cardNumber") String cardNumber) {
		String maskedCardNumber = paymentService.getMaskedCardInfo(cardNumber);
		Map<String, String> response = new HashMap<>();
		response.put("maskedCardNumber", maskedCardNumber);
		return ResponseEntity.ok(response);
	}
}
