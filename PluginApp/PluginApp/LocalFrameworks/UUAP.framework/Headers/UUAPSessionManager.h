//
//  UUAPSessionManager.h
//  UUAP
//
//  Created by Snail on 29/5/14.
//  Copyright (c) 2014 baidu. All rights reserved.
//

/**
 *  UUAPSessionManager单例
 *  -用于设置SDK基本属性
 *  -用于完成UUAP统一登录
 */
#import <Foundation/Foundation.h>
#import <UIKit/UIKit.h>
#import <UUAP/PublicDefines.h>

@interface UUAPSessionManager : NSObject

@property (copy, nonatomic) NSString *appid; //申请的appKey
@property (assign, nonatomic) BOOL usePinCode; //是否使用pinCode
@property (assign, nonatomic) NSTimeInterval pinCodeTime; //进入后台弹出pinCode间隔时间/单位秒/默认值5秒
@property (strong, nonatomic) UIWindow *window; //Application主Window

@property (copy, nonatomic) NSString *mopAppKey;
@property (copy, nonatomic) NSString *mopSecretKey;
@property (copy, nonatomic) NSString *mopAuthorzationApiName;
@property (copy, nonatomic) NSString *mopPortraitApiName;
@property (copy, nonatomic) NSString *mopRequestURL;

@property (nonatomic) SSLPublicKeyType publicKeyType;

#pragma mark - 登录登出行为
/**
 *  登录
 *
 *  @warning 如果TGT存在则不会推出登陆窗口。
 *
 *  @param completion 登陆流程完成Block
 */
- (void)ready2Login:(void (^) ())completion;

/**
 *  登出UUAP
 *
 *  @param completion logout请求完成Block
 */
- (void)logout:(void (^) ())completion;

#pragma mark - 获取用户信息行为

/**
 *  用户开发阶段, 上线需删除该方法。
 *
 *  @return tgTicket;
 */
- (NSString *)tgTicket;

/**
 *  获取applicationTicket
 *  
 *  @warning 如果因为TGT失效无法签发AT则返回nil。
 *
 *  @param finish ticket获取完成Block
 *
 *  @return applicationTicket
 */
- (void)at:(void (^) (NSString *ticket))finish;

/**
 *  获取用户名
 *
 *  @return 返回当前登录用户名
 */
- (NSString *)userName;

/**
 *  获取用户头像
 *
 *  @return 返回当前登录用户头像
 */
- (UIImage *)userPhoto;

#pragma mark - 感知程序状态

/**
 *  注册: 程序进入后台
 */
- (void)applicationDidEnterBackground;

/**
 *  注册: 程序回到前台
 */
- (void)applicationDidBecomeActive;

@end

UUAPSessionManager *SessionManager();

