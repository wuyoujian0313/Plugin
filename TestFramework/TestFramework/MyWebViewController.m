//
//  WebViewController.m
//  PluginApp
//
//  Created by wuyj on 15-1-6.
//  Copyright (c) 2015年 baidu. All rights reserved.
//

#import "MyWebViewController.h"
#import "SDImageCache.h"
#import "UIImageView+WebCache.h"

@interface MyWebViewController ()<UIWebViewDelegate,UIActionSheetDelegate>

@end

@implementation MyWebViewController

- (void)viewDidLoad {
    [super viewDidLoad];
    // Do any additional setup after loading the view.
    
    self.title = @"详情";
    
//    SDImageCache *imageCache = [SDImageCache sharedImageCache];
//    //从缓存取
//    NSString *imageUrl = @"http://pica.nipic.com/2007-11-09/2007119122712983_2.jpg";
//    UIImage *default_image = [imageCache imageFromDiskCacheForKey:imageUrl];
//    
//    UIImageView *_menuImageView = [[UIImageView alloc] initWithFrame:CGRectMake(20, 70, 40, 40)];
//    [self.view addSubview:_menuImageView];
//    
//    if (default_image == nil) {
//        default_image = [UIImage imageNamed:@"add"];
//        
//        [_menuImageView sd_setImageWithURL:[NSURL URLWithString:imageUrl]
//                          placeholderImage:default_image
//                                 completed:^(UIImage *image, NSError *error, SDImageCacheType cacheType, NSURL *imageURL) {
//                                     if (image) {
//                                         _menuImageView.image = image;
//                                         [[SDImageCache sharedImageCache] storeImage:image forKey:imageUrl];
//                                     }
//                                     
//                                 }
//         ];
//    } else {
//        _menuImageView.image = default_image;
//    }
    
    
    UIWebView *webView = [[UIWebView alloc] initWithFrame:CGRectMake(0, 200, self.view.frame.size.width, self.view.frame.size.height - 200)];
    
    webView.delegate = self;
    [webView setScalesPageToFit:YES];
    NSURL *URL = [NSURL URLWithString:[NSString stringWithFormat:@"%@",_url]];
    [webView loadRequest:[NSURLRequest requestWithURL:URL]];
    [self.view addSubview:webView];
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
