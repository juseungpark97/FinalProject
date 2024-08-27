package com.kh.last.controller;

import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

import com.kh.last.model.vo.CustomOAuth2User;

@Controller
public class AuthController {

    @GetMapping("/home")
    public String home(Model model, @AuthenticationPrincipal CustomOAuth2User customOAuth2User) {
        if (customOAuth2User == null) {
            System.out.println("User is not authenticated");
            return "redirect:/login"; // 로그인 페이지로 리디렉션
        }

        // 액세스 토큰 가져오기
        String accessToken = customOAuth2User.getToken();
        model.addAttribute("accessToken", accessToken);

        // 사용자 이름 가져오기
        String name = (String) customOAuth2User.getAttribute("name");
        model.addAttribute("name", name != null ? name : "Anonymous User");

        // React로 리디렉션하면서 액세스 토큰 전달
        return "redirect:http://localhost:3000/profiles?token=" + accessToken;
    }
}
