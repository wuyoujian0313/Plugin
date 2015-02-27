//
//  AppDelegate.m
//  PluginApp
//
//  Created by wuyj on 15-1-6.
//  Copyright (c) 2015年 baidu. All rights reserved.
//

#import "AppDelegate.h"
#import "MainViewController.h"
#import "MyNavigationController.h"


static NSString *const AppId = @"uuapclient-38-HRosXKR3qhfeXSlqniKr";
static NSString *const MopUrl = @"http://mop.baidu.com/api/2.0";
static NSString *const SecretKey = @"78b0bd92ecd447d285a847d65e758366";

@interface AppDelegate ()

@end

@implementation AppDelegate


- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions {
    // Override point for customization after application launch.

    _window = [[UIWindow alloc] initWithFrame:[[UIScreen mainScreen] bounds]];
    
    MainViewController *vc = [[MainViewController alloc] init];
    MyNavigationController *nav = [[MyNavigationController alloc] initWithRootViewController:vc];
    
    _window.rootViewController = nav;
    [_window makeKeyAndVisible];
    
    SessionManager().appid = AppId;
    SessionManager().mopSecretKey = SecretKey;
    SessionManager().mopRequestURL = MopUrl;
    
    SessionManager().window = _window;
    SessionManager().usePinCode = NO;
    SessionManager().mopAppKey = SessionManager().appid;
    SessionManager().mopAuthorzationApiName = @"liujimin.mobileDuLife.uuap_auth_v2";
    SessionManager().mopPortraitApiName = @"liujimin.portrait";
    SessionManager().publicKeyType = SSLPublicKeyTypeMop; //TEST 切换环境需要修改此处
    
    //启动删除Documents下得jpg图片
    NSString *DocumentsPath = [NSHomeDirectory() stringByAppendingPathComponent:@"Documents"];
    NSArray *contentsOfFolder = [[NSFileManager defaultManager] subpathsOfDirectoryAtPath:DocumentsPath error:NULL];
    for (NSString *filePath in contentsOfFolder) {
        if ([filePath.pathExtension isEqualToString:@"jpg"]) {
            [[NSFileManager defaultManager] removeItemAtPath:[DocumentsPath stringByAppendingPathComponent:filePath] error:NULL];
        }
    }
    
    //>>百度移动统计
    BaiduMobStat* statTracker = [BaiduMobStat defaultStat];
    statTracker.enableExceptionLog = YES; // 是否允许截获并发送崩溃信息，请设置YES或者NO
    statTracker.channelId = @"baidu market";//设置您的app的发布渠道
    statTracker.logStrategy = BaiduMobStatLogStrategyAppLaunch;//根据开发者设定的时间间隔接口发送 也可以使用启动时发送策略
    statTracker.logSendInterval = 1;  //为1时表示发送日志的时间间隔为1小时
    statTracker.logSendWifiOnly = NO; //是否仅在WIfi情况下发送日志数据
    statTracker.sessionResumeInterval = 60;//设置应用进入后台再回到前台为同一次session的间隔时间[0~600s],超过600s则设为600s，默认为30s
    //statTracker.shortAppVersion  = version; //参数为NSString * 类型,自定义app版本信息，如果不设置，默认从CFBundleVersion里取
    [statTracker startWithAppId:@"fd8223f721"];//iOS在mtj网站上添加的app的appkey
    //<<
    
    return YES;
}

- (void)applicationWillResignActive:(UIApplication *)application
{
    // Sent when the application is about to move from active to inactive state. This can occur for certain types of temporary interruptions (such as an incoming phone call or SMS message) or when the user quits the application and it begins the transition to the background state.
    // Use this method to pause ongoing tasks, disable timers, and throttle down OpenGL ES frame rates. Games should use this method to pause the game.
}

- (void)applicationDidEnterBackground:(UIApplication *)application
{
    // Use this method to release shared resources, save user data, invalidate timers, and store enough application state information to restore your application to its current state in case it is terminated later.
    // If your application supports background execution, this method is called instead of applicationWillTerminate: when the user quits.
    [SessionManager() applicationDidEnterBackground];
}

- (void)applicationWillEnterForeground:(UIApplication *)application
{
    // Called as part of the transition from the background to the inactive state; here you can undo many of the changes made on entering the background.
}

- (void)applicationDidBecomeActive:(UIApplication *)application
{
    // Restart any tasks that were paused (or not yet started) while the application was inactive. If the application was previously in the background, optionally refresh the user interface.
    [SessionManager() applicationDidBecomeActive];
}

- (void)applicationWillTerminate:(UIApplication *)application
{
    // Called when the application is about to terminate. Save data if appropriate. See also applicationDidEnterBackground:.
}

@end
