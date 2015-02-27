//
//  NetworkTask.h
//
//
//  Created by wuyj on 14-9-2.
//  Copyright (c) 2014年 wuyj. All rights reserved.
//

#import <Foundation/Foundation.h>



static NSString const *kNetworkAPIServer = @"";

@class NetResultBase;
@protocol NetworkTaskDelegate <NSObject>

@optional
-(void)netResultSuccessBack:(NetResultBase *)result forInfo:(id)customInfo;
-(void)netResultFailBack:(NSString *)error forInfo:(id)customInfo;

@end



@interface NetworkTask : NSObject

@property(nonatomic, assign) NSTimeInterval taskTimeout;

+ (NetworkTask *)sharedNetworkTask;

// GET
- (void)addGETTaskApi:(NSString*)api
             forParam:(NSDictionary *)param
                token:(NSString *)token
             delegate:(id <NetworkTaskDelegate>)delegate
     receiveResultObj:(NetResultBase*)resultObj
           customInfo:(id)customInfo;

- (void)addGETTaskURL:(NSString*)urlString
                token:(NSString *)token
             delegate:(id <NetworkTaskDelegate>)delegate
     receiveResultObj:(NetResultBase*)resultObj
           customInfo:(id)customInfo;

// POST
- (void)addPOSTTaskApi:(NSString*)api
              forParam:(NSDictionary *)param
                 token:(NSString *)token
              delegate:(id <NetworkTaskDelegate>)delegate
      receiveResultObj:(NetResultBase*)resultObj
            customInfo:(id)customInfo;

// PUT
- (void)addPUTTaskApi:(NSString*)api
             forParam:(NSDictionary *)param
                token:(NSString *)token
             delegate:(id <NetworkTaskDelegate>)delegate
     receiveResultObj:(NetResultBase*)resultObj
           customInfo:(id)customInfo;

// DELETE
- (void)addDELETETaskApi:(NSString*)api
                forParam:(NSDictionary *)param
                   token:(NSString *)token
                delegate:(id <NetworkTaskDelegate>)delegate
        receiveResultObj:(NetResultBase*)resultObj
              customInfo:(id)customInfo;

@end
