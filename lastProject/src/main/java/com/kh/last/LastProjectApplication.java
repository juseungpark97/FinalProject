package com.kh.last;

import io.github.cdimascio.dotenv.Dotenv;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class LastProjectApplication {

	public static void main(String[] args) {
	    Dotenv dotenv = Dotenv.configure().ignoreIfMissing().load();

	    setSystemProperty("DB_URL", dotenv.get("DB_URL"));
	    setSystemProperty("DB_USERNAME", dotenv.get("DB_USERNAME"));
	    setSystemProperty("DB_PASSWORD", dotenv.get("DB_PASSWORD"));
	    setSystemProperty("AWS_ACCESS_KEY_ID", dotenv.get("AWS_ACCESS_KEY_ID"));
	    setSystemProperty("AWS_SECRET_ACCESS_KEY", dotenv.get("AWS_SECRET_ACCESS_KEY"));
	    setSystemProperty("AWS_S3_BUCKET_NAME", dotenv.get("AWS_S3_BUCKET_NAME"));
	    setSystemProperty("AWS_REGION", dotenv.get("AWS_REGION"));
	    setSystemProperty("GOOGLE_CLIENT_ID", dotenv.get("GOOGLE_CLIENT_ID"));
	    setSystemProperty("GOOGLE_CLIENT_SECRET", dotenv.get("GOOGLE_CLIENT_SECRET"));
	    setSystemProperty("GOOGLE_REDIRECT_URI", dotenv.get("GOOGLE_REDIRECT_URI"));

	    setSystemProperty("PAYPAL_CLIENT_ID", dotenv.get("PAYPAL_CLIENT_ID"));
	    setSystemProperty("PAYPAL_CLIENT_SECRET", dotenv.get("PAYPAL_CLIENT_SECRET"));
	    setSystemProperty("PAYPAL_MODE", dotenv.get("PAYPAL_MODE"));

	    setSystemProperty("SMTP_HOST", dotenv.get("SMTP_HOST"));
	    setSystemProperty("SMTP_PORT", dotenv.get("SMTP_PORT"));
	    setSystemProperty("SMTP_USERNAME", dotenv.get("SMTP_USERNAME"));
	    setSystemProperty("SMTP_PASSWORD", dotenv.get("SMTP_PASSWORD"));

	    SpringApplication.run(LastProjectApplication.class, args);
	}

	private static void setSystemProperty(String key, String value) {
	    if (value != null) {
	        System.setProperty(key, value);
	    } else {
	        System.out.println("Warning: Environment variable " + key + " is missing or null.");
	    }
	}
}
