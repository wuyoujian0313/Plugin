//
//  DulifeVC.m
//  PluginApp
//
//  Created by wuyj on 15-1-14.
//  Copyright (c) 2015年 baidu. All rights reserved.
//

#import "DulifeVC.h"
#import "UIActionSheet+Blocks.h"
#import "Base64.h"
#import <UUAP/UUAP.h>
#import <UUAP/UUAPSessionManager.h>


static NSString *const StartImagePickerAPIString = @"life://api/pickmedia?x=640&y=480"; //API URL
static float const ImageQuality = 0.8; //图片质量

static NSString *const FileTransferAPIString = @"life://api/filetransfer";
static NSString *const LocalURIKey = @"localuri";
static NSString *const UploadURLKey = @"uploadurl";

static NSString *const SafariAPIString = @"life://api/browser";
static NSString *const SafariLink = @"link";

static NSString *const WindowModeAPIString = @"life://api/setWindowMode";
static NSString *const FullScreen = @"fullScreen";

static NSString *const LoginAPIString = @"life://api/tryLogin";
static NSString *const UpdateTokenAPIString = @"life://api/updateToken";
static NSString *const LogoutAPIString = @"life://api/logout";

static NSString *const CookieHost = @"http://mop.baidu.com";
static NSTimeInterval const LoopTimer = 30 * 60 - 20;

@interface DulifeVC ()<UIImagePickerControllerDelegate, UINavigationControllerDelegate,UIWebViewDelegate>
@property (strong, nonatomic)UIWebView *indexWebView;
@end

@implementation DulifeVC

-(void)viewWillAppear:(BOOL)animated {
    [self.navigationController setNavigationBarHidden:YES];
}

- (void)viewDidLoad
{
    [super viewDidLoad];
    
    
    UIWebView *webView = [[UIWebView alloc] initWithFrame:CGRectMake(0, 0, self.view.frame.size.width, self.view.frame.size.height - navigationBarHeight)];
    
    webView.delegate = self;
    [webView setScalesPageToFit:YES];
    [self setIndexWebView:webView];
    
    self.indexWebView.scrollView.bounces = NO;
    self.indexWebView.allowsInlineMediaPlayback = YES;
    self.indexWebView.mediaPlaybackRequiresUserAction = NO;
    [self.indexWebView loadRequest:[NSURLRequest requestWithURL:[NSURL fileURLWithPath:[NSString stringWithFormat:@"%@/index.html",[[NSBundle mainBundle] pathForResource:@"content" ofType:@""]]]]];
    
    if (SessionManager().userName.length > 0) {
        [SessionManager() at:^(NSString *ticket) {
            if (ticket) {
                [self setCookie:ticket];
            }
        }];
    }
    
    
    [SessionManager() ready2Login:^{
        [SessionManager() at:^(NSString *ticket) {
            NSLog(@"ticket %@", ticket);
            if (ticket) {
                [self setCookie:ticket];
                [_indexWebView stringByEvaluatingJavaScriptFromString:[NSString stringWithFormat:@"getUserName('%@')", SessionManager().userName]];
                NSLog(@"设置用户名:%@",SessionManager().userName);
                [_indexWebView stringByEvaluatingJavaScriptFromString:@"onLoginSuccess()"];
            } else {
                [_indexWebView stringByEvaluatingJavaScriptFromString:[NSString stringWithFormat:@"updateToken(%@)", @"1"]];
            }
        }];
    }];
    
    [AFNetworkActivityIndicatorManager sharedManager].enabled = YES;
    //NSLog(@"移动统计");
    NSTimer *timer = [NSTimer scheduledTimerWithTimeInterval:LoopTimer target:self selector:@selector(timerCallback) userInfo:nil repeats:YES];
    [[NSRunLoop currentRunLoop] addTimer:timer forMode:NSRunLoopCommonModes];
    
    [self.view addSubview:webView];
}

-(void)viewDidAppear:(BOOL)animated
{
    [super viewDidAppear:animated];
    [[BaiduMobStat defaultStat] pageviewStartWithName:@"DulifeVC"];
    if (SessionManager().userName.length > 0) {
        [SessionManager() at:^(NSString *ticket) {
            if (ticket) {
                [self setCookie:ticket];
            }
        }];
    }
}

-(void)viewDidDisappear:(BOOL)animated
{
    [super viewDidDisappear:animated];
    [[BaiduMobStat defaultStat] pageviewEndWithName:@"DulifeVC"];
}

- (void)viewDidLayoutSubviews
{
    if ([[[UIDevice currentDevice] systemVersion] floatValue] >= 7 && ![UIApplication sharedApplication].statusBarHidden) {
        _indexWebView.frame = CGRectMake(0, 20, CGRectGetWidth(self.view.frame), CGRectGetHeight(self.view.frame) - 20);
    }
}

- (void)didReceiveMemoryWarning
{
    [super didReceiveMemoryWarning];
    // Dispose of any resources that can be recreated.
}

#pragma mark - Timer
- (void)timerCallback
{
    if (SessionManager().userName) {
        [SessionManager() at:^(NSString *ticket) {
            if (ticket) {
                [self setCookie:ticket];
            }
        }];
    }
}

#pragma mark - UIWebView Delegate
- (BOOL)webView:(UIWebView *)webView shouldStartLoadWithRequest:(NSURLRequest *)request navigationType:(UIWebViewNavigationType)navigationType
{
    NSString *absoluteURLString = request.URL.absoluteString;
    if ([absoluteURLString hasSuffix:StartImagePickerAPIString]) {
        UIActionSheet *actionSheet = [[UIActionSheet alloc] initWithTitle:@"请选择操作"
                                                         cancelButtonItem:[RIButtonItem itemWithLabel:@"取  消" action:^{
            
        }]
                                                    destructiveButtonItem:[RIButtonItem itemWithLabel:@"拍  照" action:^{
            [self startImagePicker:UIImagePickerControllerSourceTypeCamera];
        }]
                                                         otherButtonItems:[RIButtonItem itemWithLabel:@"选  择" action:^{
            [self startImagePicker:UIImagePickerControllerSourceTypePhotoLibrary];
        }], nil];
        [actionSheet showInView:self.view];
        return NO;
    } else if ([absoluteURLString hasPrefix:FileTransferAPIString]) {
        [self startFileUpload:request.URL.query];
        return NO;
    } else if ([absoluteURLString hasPrefix:SafariAPIString]) {
        NSMutableDictionary *queryStringDictionary = [self queryString2Dictionary:request.URL.query];
        NSURL *safariURL = [NSURL URLWithString:[queryStringDictionary[SafariLink] stringByReplacingPercentEscapesUsingEncoding:NSUTF8StringEncoding]];
        [[UIApplication sharedApplication] openURL:safariURL];
        return NO;
    } else if ([absoluteURLString hasPrefix:@"http://"] || [absoluteURLString hasPrefix:@"https://"]) {
        [[UIApplication sharedApplication] openURL:[NSURL URLWithString:absoluteURLString]];
        return NO;
    } else if ([absoluteURLString hasPrefix:WindowModeAPIString]) {
        if ([[[UIDevice currentDevice] systemVersion] floatValue] >= 7) {
            NSMutableDictionary *queryStringDictionary = [self queryString2Dictionary:request.URL.query];
            NSLog(@"%@", queryStringDictionary[FullScreen]);
            NSString *isFullScreen = queryStringDictionary[FullScreen];
            if ([isFullScreen isEqualToString:@"true"]) {
                [[UIApplication sharedApplication] setStatusBarHidden:YES];
            } else {
                [[UIApplication sharedApplication] setStatusBarHidden:NO];
                _indexWebView.frame = CGRectMake(0, 20, CGRectGetWidth(self.view.frame), CGRectGetHeight(self.view.frame) - 20);
            }
        }
        return NO;
    } else if ([absoluteURLString hasPrefix:LoginAPIString]) {
        NSLog(@"%@", LoginAPIString);
        [SessionManager() ready2Login:^{
            [SessionManager() at:^(NSString *ticket) {
                NSLog(@"ticket %@", ticket);
                if (ticket) {
                    [self setCookie:ticket];
                    [_indexWebView stringByEvaluatingJavaScriptFromString:[NSString stringWithFormat:@"getUserName('%@')", SessionManager().userName]];
                    NSLog(@"设置用户名:%@",SessionManager().userName);
                    [_indexWebView stringByEvaluatingJavaScriptFromString:@"onLoginSuccess()"];
                } else {
                    [_indexWebView stringByEvaluatingJavaScriptFromString:[NSString stringWithFormat:@"updateToken(%@)", @"1"]];
                }
            }];
        }];
        return NO;
    } else if ([absoluteURLString hasPrefix:UpdateTokenAPIString]) {
        NSLog(@"%@", UpdateTokenAPIString);
        [SessionManager() at:^(NSString *ticket) {
            NSLog(@"UpdateToken ticket %@", ticket);
            if (ticket) {
                [self setCookie:ticket];
                [_indexWebView stringByEvaluatingJavaScriptFromString:[NSString stringWithFormat:@"updateToken(%@)", @"2"]];
            } else {
                [_indexWebView stringByEvaluatingJavaScriptFromString:[NSString stringWithFormat:@"updateToken(%@)", @"1"]];
            }
        }];
        return NO;
    } else if ([absoluteURLString hasPrefix:LogoutAPIString]) {
        NSLog(@"%@", LogoutAPIString);
        [SessionManager() logout:^{
            [_indexWebView stringByEvaluatingJavaScriptFromString:[NSString stringWithFormat:@"getUserName('%@')", @""]];
            NSLog(@"设置用户名为空");
            [self setCookie:@""];
            [_indexWebView stringByEvaluatingJavaScriptFromString:[NSString stringWithFormat:@"updateToken(%@)", @"1"]];
        }];
        return NO;
    }
    else if ([absoluteURLString hasPrefix:@"ios-log:"])
    {
        //LOG
        NSString* logString = [[[absoluteURLString stringByReplacingPercentEscapesUsingEncoding: NSUTF8StringEncoding] componentsSeparatedByString:@":#iOS#"] objectAtIndex:1];
        NSLog(@"UIWebView console: %@", logString);
        return NO;
    }
    else
    {
        NSLog(@"请求:%@", absoluteURLString);
        return YES;
    }
    return YES;
}

#pragma mark - Start ImagePicker
- (void)startImagePicker:(UIImagePickerControllerSourceType)pickerSourceType
{
    [MBProgressHUD showHUDAddedTo:_indexWebView animated:YES];
    if ([UIImagePickerController isSourceTypeAvailable: UIImagePickerControllerSourceTypeCamera]) {
        UIImagePickerController *imagePicker = [[UIImagePickerController alloc] init];
        imagePicker.delegate = self;
        imagePicker.sourceType = pickerSourceType;
        [self presentViewController:imagePicker animated:YES completion:^{
            [MBProgressHUD hideHUDForView:_indexWebView animated:YES];
        }];
    }
}

#pragma mark - ImagePicker Delegate
- (void)imagePickerController:(UIImagePickerController *)picker didFinishPickingMediaWithInfo:(NSDictionary *)info
{
    @autoreleasepool {
        NSString *type = [info objectForKey:UIImagePickerControllerMediaType];
        if ([type isEqualToString:@"public.image"]) {
            UIImage *image = [info objectForKey:UIImagePickerControllerOriginalImage];
            
            float targetWidth = [UIApplication sharedApplication].keyWindow.bounds.size.width * 2;
            float targetHeight = image.size.height * targetWidth / image.size.width;
            UIGraphicsBeginImageContext(CGSizeMake(targetWidth, targetHeight));
            [image drawInRect:CGRectMake(0, 0, targetWidth, targetHeight)];
            UIImage *scaledImage = UIGraphicsGetImageFromCurrentImageContext();
            UIGraphicsEndImageContext();
            
            NSData *data = UIImageJPEGRepresentation(scaledImage, ImageQuality);
            NSString *DocumentsPath = [NSHomeDirectory() stringByAppendingPathComponent:@"Documents"];
            NSString *filePath = [DocumentsPath stringByAppendingPathComponent:[NSString stringWithFormat:@"%.0lf.jpg", [[NSDate date] timeIntervalSince1970]]];
            [[NSFileManager defaultManager] createFileAtPath:filePath contents:data attributes:nil];
            [picker dismissViewControllerAnimated:YES completion:^{
                [_indexWebView stringByEvaluatingJavaScriptFromString:[NSString stringWithFormat:@"onMediaPickSuccess('%@');", filePath]];
            }];
        } else {
            NSLog(@"Error Type!");
        }
    }
}

- (void)imagePickerControllerDidCancel:(UIImagePickerController *)picker
{
    [picker dismissViewControllerAnimated:YES completion:nil];
}

- (void)startFileUpload:(NSString *)queryString
{
    NSMutableDictionary *queryStringDictionary = [self queryString2Dictionary:queryString];
    NSLog(@"%@", queryStringDictionary[LocalURIKey]);
    NSLog(@"%@", queryStringDictionary[UploadURLKey]);
    
    AFHTTPRequestOperationManager *manager = [AFHTTPRequestOperationManager manager];
    NSDictionary *parameters = @{};
    NSURL *filePath = [NSURL fileURLWithPath:queryStringDictionary[LocalURIKey]];
    NSString *requestString = queryStringDictionary[UploadURLKey];
    
    [manager.requestSerializer setValue:@"liujimin.mobileDuLife.uploadFile" forHTTPHeaderField:@"X-Mop-Api-Name"];
    [manager.requestSerializer setValue:SessionManager().mopAppKey forHTTPHeaderField:@"X-Mop-Appkey"];
    [manager POST:requestString parameters:parameters constructingBodyWithBlock:^(id<AFMultipartFormData> formData) {
        [formData appendPartWithFileURL:filePath name:@"file" error:nil];
    } success:^(AFHTTPRequestOperation *operation, id responseObject) {
        NSLog(@"Success: %@", responseObject);
        NSError *error = nil;
        NSData *jsonData = [NSJSONSerialization dataWithJSONObject:responseObject
                                                           options:NSJSONWritingPrettyPrinted
                                                             error:&error];
        if (jsonData.length > 0 && !error) {
            NSString *responseString = [[[NSString alloc] initWithData:jsonData encoding:NSUTF8StringEncoding] stringByAddingPercentEscapesUsingEncoding:NSUTF8StringEncoding];
            
            [_indexWebView stringByEvaluatingJavaScriptFromString:[NSString stringWithFormat:@"onFileTransfered(\"%ld\", \"%@\");", (long)operation.response.statusCode, [responseString base64EncodedString]]];
        } else {
            NSLog(@"Error");
        }
    } failure:^(AFHTTPRequestOperation *operation, NSError *error) {
        NSLog(@"Error: %@", error);
        [_indexWebView stringByEvaluatingJavaScriptFromString:[NSString stringWithFormat:@"onFileTransfered(\"%ld\", \"%@\");", (long)operation.response.statusCode, error.localizedDescription]];
    }];
}

- (NSMutableDictionary *)queryString2Dictionary:(NSString *)queryString
{
    NSMutableDictionary *queryStringDictionary = [[NSMutableDictionary alloc] init];
    NSArray *urlComponents = [queryString componentsSeparatedByString:@"&"];
    for (NSString *keyValuePair in urlComponents)
    {
        NSArray *pairComponents = [keyValuePair componentsSeparatedByString:@"="];
        NSString *key = [pairComponents objectAtIndex:0];
        NSString *value = [pairComponents objectAtIndex:1];
        
        [queryStringDictionary setObject:[value stringByReplacingPercentEscapesUsingEncoding:NSUTF8StringEncoding] forKey:key];
    }
    return queryStringDictionary;
}

- (void)setCookie:(NSString *)at{
    NSURL *cookieHost = [NSURL URLWithString:CookieHost];
    
    NSHTTPCookie *cookie = [NSHTTPCookie cookieWithProperties:
                            [NSDictionary dictionaryWithObjectsAndKeys:
                             [cookieHost host], NSHTTPCookieDomain,
                             [cookieHost path], NSHTTPCookiePath,
                             @"uuap-at",  NSHTTPCookieName,
                             at, NSHTTPCookieValue,
                             nil]];
    
    [[NSHTTPCookieStorage sharedHTTPCookieStorage] setCookie:cookie];
}


@end
