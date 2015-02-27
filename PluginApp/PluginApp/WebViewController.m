//
//  WebViewController.m
//  PluginApp
//
//  Created by wuyj on 15-1-6.
//  Copyright (c) 2015年 baidu. All rights reserved.
//

#import "WebViewController.h"

@interface WebViewController ()<UIWebViewDelegate,UIActionSheetDelegate>

@end

@implementation WebViewController

- (void)viewDidLoad {
    [super viewDidLoad];
    // Do any additional setup after loading the view.
    
    self.title = _menu.name;
    UIWebView *webView = [[UIWebView alloc] initWithFrame:CGRectMake(0, 0, self.view.frame.size.width, self.view.frame.size.height - navigationBarHeight)];
    
    webView.delegate = self;
    [webView setScalesPageToFit:YES];
    NSURL *URL = [NSURL URLWithString:[NSString stringWithFormat:@"http://%@",_menu.url]];
    [webView loadRequest:[NSURLRequest requestWithURL:URL]];
    [self.view addSubview:webView];
    

    NSString *type = _menu.type;
    if ([type isEqualToString:@"hybird"]) {
        
        UIButton *btnMore=[[UIButton alloc] initWithFrame:CGRectMake(0, 0, 36, 36)];
        [btnMore setImage:[UIImage imageNamed:@"more"] forState:UIControlStateNormal];
        [btnMore addTarget:self action:@selector(btnMoreClick:) forControlEvents:UIControlEventTouchUpInside];
        if(IsIOS7) {
            btnMore.contentEdgeInsets = UIEdgeInsetsMake(0, 0, 0, -20);
        }
        UIBarButtonItem *MoreBarBtn = [[UIBarButtonItem alloc] initWithCustomView:btnMore];
        self.navigationItem.rightBarButtonItem = MoreBarBtn;
        
    }
}

-(void)btnMoreClick:(UIButton *)sender {
    UIActionSheet* actionSheet = [[UIActionSheet alloc] initWithTitle:nil
                                                             delegate:self
                                                    cancelButtonTitle:@"取消"
                                               destructiveButtonTitle:@"菜单一"
                                                    otherButtonTitles:@"菜单二",@"菜单三", nil];
    
    [actionSheet showInView:self.view];
}

- (void)didReceiveMemoryWarning {
    [super didReceiveMemoryWarning];
    // Dispose of any resources that can be recreated.
}

- (void)actionSheet:(UIActionSheet *)actionSheet clickedButtonAtIndex:(NSInteger)buttonIndex {
    
}

#pragma mark - UIWebViewDelegate

- (BOOL)webView:(UIWebView *)webView shouldStartLoadWithRequest:(NSURLRequest *)request navigationType:(UIWebViewNavigationType)navigationType {
    return YES;
}

- (void)webViewDidStartLoad:(UIWebView *)webView {
    
}

- (void)webViewDidFinishLoad:(UIWebView *)webView  {
    
}


- (void)webView:(UIWebView *)webView didFailLoadWithError:(NSError *)error {
    
}

@end
