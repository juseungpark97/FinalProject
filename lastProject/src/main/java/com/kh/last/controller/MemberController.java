package com.kh.last.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import com.kh.last.model.vo.Member;
import com.kh.last.service.MemberService;

@Controller
public class MemberController {

    @Autowired
    private MemberService memberService;

    @GetMapping("/members/new")
    public String showCreateForm(Model model) {
        model.addAttribute("member", new Member());
        return "createMember";
    }

    @PostMapping("/members")
    public String addMember(@ModelAttribute Member member) {
        memberService.saveMember(member);
        return "redirect:/members/new";
    }
}
