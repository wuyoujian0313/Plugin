//
//  NetworkTask.m
//
//
//  Created by wuyj on 14-9-2.
//  Copyright (c) 2014年 wuyj. All rights reserved.
//

#import "NetworkTask.h"
#import "ASIFormDataRequest.h"
#import "NetResultBase.h"



@interface NSDictionary (WYJJointREST_GETURL)

-(NSURL *)jointREST_GETURL:(NSString *)url;

@end

@implementation NSDictionary (WYJJointREST_GETParam)

-(NSURL *)jointREST_GETURL:(NSString *)urlString {
    
    NSArray *allkeys = [self allKeys];
    NSMutableArray *paraArray = [NSMutableArray array];
    
    for(NSString *key in allkeys) {
        NSDictionary* tempDic = [self objectForKey:key];
        if ([tempDic isKindOfClass:[NSDictionary class]]&&[tempDic.allKeys count]>1) {
            for (NSString* key1 in tempDic.allKeys) {
                [paraArray addObject:[NSString stringWithFormat:@"%@=%@", key1, [tempDic objectForKey:key1]]];
            }
        }
        else{
            [paraArray addObject:[NSString stringWithFormat:@"%@=%@", key, [self objectForKey:key]]];
        }
    }
    
    if (paraArray.count>0) {
        urlString = [urlString stringByAppendingFormat:@"?%@",[paraArray componentsJoinedByString:@"&"]];
    }
    
    urlString = [urlString stringByAddingPercentEscapesUsingEncoding:NSUTF8StringEncoding];
    NSURL *urlobj = [NSURL URLWithString:urlString];
    
    return urlobj;
}

- (id)safeObjectForKey:(NSString*)Key {
    NSArray* keys = self.allKeys;
    BOOL keyisture=NO;
    for (NSString* keystr in keys) {
        if ([keystr isEqualToString:Key]) {
            keyisture=YES;
        }
    }
    
    if (keyisture) {
        if ([[self objectForKey:Key] isKindOfClass:[NSNumber class]]) {
            return [[self objectForKey:Key] stringValue];
        }
        if ([[self objectForKey:Key] isKindOfClass:[NSNull class]]) {
            return nil;
        }
        return [self objectForKey:Key];
        
    }
    return nil;
}

@end

@interface ASIFormDataRequest (WYJAddFormFromDictionary)

-(void)addFormFromDictionary:(NSDictionary *)param;

@end

@implementation ASIFormDataRequest (WYJAddFormFromDictionary)

-(void)addFormFromDictionary:(NSDictionary *)param {
    
    if (param == nil && [param count] == 0) {
        return;
    }
    
    NSArray *allkeys = [param allKeys];
    
    for(NSString *key in allkeys){
        if ([[param safeObjectForKey:key] isKindOfClass:[NSString class]]) {
            [self addPostValue:[param safeObjectForKey:key] forKey:key];
            
        } else if ([[param safeObjectForKey:key] isKindOfClass:[NSArray class]]) {
            for (id object in [param safeObjectForKey:key]) {
                
                if ([object isKindOfClass:[NSString class]]) {
                    
                    [self addPostValue:object forKey:[NSString stringWithFormat:@"%@[]",key]];
                    
                } else if ([object isKindOfClass:[NSDictionary class]]) {
                    
                    NSDictionary* dic = object;
                    
                    for (NSString* subKey in dic.allKeys) {
                        
                        [self addPostValue:[param safeObjectForKey:subKey] forKey:[NSString stringWithFormat:@"%@[][%@]",key,subKey]];
                        
                    }
                }
            }
        }
    }
}

@end



@interface NetworkTask ()<ASIHTTPRequestDelegate>

@property (nonatomic, strong) NSMutableSet           *requestSet;

@end


@implementation NetworkTask


+ (NetworkTask *)sharedNetworkTask {
    
    static NetworkTask *netTask = nil;
    static dispatch_once_t onceToken;
    dispatch_once(&onceToken, ^{
        netTask = [[self alloc] init];
    });
    return netTask;
}


-(id)init {
    if (self = [super init]) {
        self.taskTimeout = 15;
        self.requestSet = [[NSMutableSet alloc] initWithCapacity:0];
    }
    
    return self;
}

- (void)requestWithMethod:(NSString *)method
                      api:(NSString *)api
                    param:(NSDictionary *)param
                    token:(NSString *)token
                 delegate:(id <NetworkTaskDelegate>)delegate
         receiveResultObj:(NetResultBase*)resultObj
               customInfo:(id)customInfo {
    // =============================================================
    // 发送网络请求
    // =============================================================
    // 创建请求对象
    
    NSString * urlString = [NSString stringWithFormat:@"%@/%@",kNetworkAPIServer,api];
    NSURL *URL = [NSURL URLWithString:urlString];
    
    if ([method isEqualToString:@"GET"]) {
        if (param !=nil && [param count] > 0) {
            URL = [param jointREST_GETURL:urlString];
        }
    }
    
    ASIFormDataRequest* req = [ASIFormDataRequest requestWithURL:URL];
    [req setRequestMethod:method];
    if (![method isEqualToString:@"GET"]) {
        
        [req addFormFromDictionary:param];
    }
    
    
    if (token != nil && [token length] > 0) {
        NSString *bear = [NSString stringWithFormat:@"Bearer %@", token];
        NSMutableDictionary *dic = [[NSMutableDictionary alloc] init];
        [dic setObject:bear forKey:@"Authorization"]; //请求头的key为Authorization
        [req setRequestHeaders:dic]; // 设置请求头字典
    }
    
    NSMutableDictionary *userInfo = [[NSMutableDictionary alloc] init];
    if (customInfo != nil) {
        [userInfo setObject:customInfo forKey:@"customInfo"];
    }
    
    if (delegate != nil) {
        [userInfo setObject:delegate forKey:@"delegate"];
    }
    
    if (resultObj != nil) {
        [userInfo setObject:resultObj forKey:@"resultObj"];
    }
    
    [req setUserInfo:userInfo];
    
    [req setTimeOutSeconds:_taskTimeout];
    [req setResponseEncoding:NSUTF8StringEncoding];
    [req setDelegate:self];
    [req setDidFinishSelector:@selector(requestFinished:)];
    [req setDidFailSelector:@selector(requestFailed:)];
    [req startAsynchronous];
    
    [self.requestSet addObject:req];
}

- (void)addGETTaskURL:(NSString*)urlString
                token:(NSString *)token
             delegate:(id <NetworkTaskDelegate>)delegate
     receiveResultObj:(NetResultBase*)resultObj
           customInfo:(id)customInfo {
    // =============================================================
    // 发送网络请求
    // =============================================================
    // 创建请求对象
    
    NSURL *URL = [NSURL URLWithString:urlString];
    
    ASIFormDataRequest* req = [ASIFormDataRequest requestWithURL:URL];
    [req setRequestMethod:@"GET"];
    
    if (token != nil && [token length] > 0) {
        NSString *bear = [NSString stringWithFormat:@"Bearer %@", token];
        NSMutableDictionary *dic = [[NSMutableDictionary alloc] init];
        [dic setObject:bear forKey:@"Authorization"]; //请求头的key为Authorization
        [req setRequestHeaders:dic]; // 设置请求头字典
    }
    
    NSMutableDictionary *userInfo = [[NSMutableDictionary alloc] init];
    if (customInfo != nil) {
        [userInfo setObject:customInfo forKey:@"customInfo"];
    }
    
    if (delegate != nil) {
        [userInfo setObject:delegate forKey:@"delegate"];
    }
    
    if (resultObj != nil) {
        [userInfo setObject:resultObj forKey:@"resultObj"];
    }
    
    [req setUserInfo:userInfo];
    
    [req setTimeOutSeconds:_taskTimeout];
    [req setResponseEncoding:NSUTF8StringEncoding];
    [req setDelegate:self];
    [req setDidFinishSelector:@selector(requestFinished:)];
    [req setDidFailSelector:@selector(requestFailed:)];
    [req startAsynchronous];
    
    [self.requestSet addObject:req];
    
}

- (void)addGETTaskApi:(NSString*)api
             forParam:(NSDictionary *)param
                token:(NSString *)token
             delegate:(id <NetworkTaskDelegate>)delegate
     receiveResultObj:(NetResultBase*)resultObj
           customInfo:(id)customInfo {
    
    [self requestWithMethod:@"GET"
                        api:api
                      param:param
                      token:token
                   delegate:delegate
           receiveResultObj:resultObj
                 customInfo:customInfo];
}

- (void)addPOSTTaskApi:(NSString*)api
              forParam:(NSDictionary *)param
                 token:(NSString *)token
              delegate:(id <NetworkTaskDelegate>)delegate
      receiveResultObj:(NetResultBase*)resultObj
            customInfo:(id)customInfo {
    
    [self requestWithMethod:@"POST"
                        api:api
                      param:param
                      token:token
                   delegate:delegate
           receiveResultObj:resultObj
                 customInfo:customInfo];
}


- (void)addPUTTaskApi:(NSString*)api
             forParam:(NSDictionary *)param
                token:(NSString *)token
             delegate:(id <NetworkTaskDelegate>)delegate
     receiveResultObj:(NetResultBase*)resultObj
           customInfo:(id)customInfo {
    
    [self requestWithMethod:@"PUT"
                        api:api
                      param:param
                      token:token
                   delegate:delegate
           receiveResultObj:resultObj
                 customInfo:customInfo];
}

- (void)addDELETETaskApi:(NSString*)api
                forParam:(NSDictionary *)param
                   token:(NSString *)token
                delegate:(id <NetworkTaskDelegate>)delegate
        receiveResultObj:(NetResultBase*)resultObj
              customInfo:(id)customInfo {
    
    [self requestWithMethod:@"DELETE"
                        api:api
                      param:param
                      token:token
                   delegate:delegate
           receiveResultObj:resultObj
                 customInfo:customInfo];
}

-(void)requestFinished:(ASIHTTPRequest*)req {
    // 解析数据
    NSDictionary *userInfo = req.userInfo;
    [self.requestSet removeObject:req];
    
    NSLog(@"responseString:%@",req.responseString);
    
    NetResultBase *result = [userInfo objectForKey:@"resultObj"];
    id customInfo = [userInfo objectForKey:@"customInfo"];
    id <NetworkTaskDelegate> delegate = [userInfo objectForKey:@"delegate"];
    @autoreleasepool{
        [result autoParseJsonData:req.responseData];
    }
    
    if(result.ret != nil && ( [result.ret integerValue] != 0)) {
        if (delegate != nil && [delegate respondsToSelector:@selector(netResultFailBack:forInfo:)]) {
            [delegate netResultFailBack:@"发生请求错误" forInfo:customInfo];
        }
        
        return;
    }
    
    if (delegate != nil && [delegate respondsToSelector:@selector(netResultSuccessBack:forInfo:)]) {
        [delegate netResultSuccessBack:result forInfo:customInfo];
    }
}

-(void)requestFailed:(ASIHTTPRequest*)req {
    NSDictionary *userInfo = req.userInfo;
    
    [self.requestSet removeObject:req];
    id customInfo = [userInfo objectForKey:@"customInfo"];
    id <NetworkTaskDelegate> delegate = [userInfo objectForKey:@"delegate"];
    
    NSError *error = req.error;
    NSString *errorString = @"网络错误";
    if (error.code == ASIConnectionFailureErrorType) {
        errorString = @"网络连接错误！";
    } else if (error.code == ASIRequestTimedOutErrorType){
        errorString = @"网络连接超时！";
    } else {
        errorString = @"网络错误";
    }
    
    if (delegate != nil && [delegate respondsToSelector:@selector(netResultFailBack:forInfo:)]) {
        [delegate netResultFailBack:errorString forInfo:customInfo];
    }
}


@end
