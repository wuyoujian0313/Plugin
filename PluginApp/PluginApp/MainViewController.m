//
//  MainViewController.m
//  PluginApp
//
//  Created by wuyj on 15-1-6.
//  Copyright (c) 2015年 baidu. All rights reserved.
//

#import "MainViewController.h"
#import "MenuCollectionViewCell.h"
#import "NetworkTask.h"
#import "MenuResult.h"
#import "AddMenuViewController.h"
#import "WebViewController.h"
#import "ASIHTTPRequest.h"
#import "ZipArchive.h"
#import <dlfcn.h>
#import "EnterProtocol.h"
#import "MyNavigationController.h"
#import "DulifeVC.h"


extern void* lib_handle;
@interface MainViewController ()<UICollectionViewDelegate,UICollectionViewDataSource,NetworkTaskDelegate,MenuCollectionCellDelegate>

@property(nonatomic,strong)UICollectionView     *mainMenuView;
@property(nonatomic,strong)NSArray              *menus;

@property(nonatomic,strong)NSArray              *displayMenus;

@property(nonatomic,strong)MenuResult           *result;
@property(nonatomic,assign)BOOL                 openDelete;

@property(nonatomic,strong)NSBundle *libbundle;

@end

@implementation MainViewController

-(void)viewWillAppear:(BOOL)animated {
    [_mainMenuView reloadData];
}

- (void)viewDidLoad {
    [super viewDidLoad];

    self.title = @"服务中心";
    _openDelete = NO;
    
    [self layoutMenuView];
    [self requestMenu];
    
    [[NSNotificationCenter defaultCenter] addObserver:self
                                             selector:@selector(reloadData)
                                                 name:@"uplateData"
                                               object:nil];
    
//    UIBarButtonItem *refreshBtn = [[UIBarButtonItem alloc] initWithBarButtonSystemItem:UIBarButtonSystemItemRefresh target:self action:@selector(refresh)];
//    self.navigationItem.rightBarButtonItem = refreshBtn;
    
}

-(void)refresh {
    NSArray* paths = NSSearchPathForDirectoriesInDomains(NSDocumentDirectory,NSUserDomainMask,YES);
    NSString *documentDirectory = nil;
    if ([paths count] != 0)
        documentDirectory = [paths objectAtIndex:0];
    
    NSFileManager *fileManager = [NSFileManager defaultManager];
    NSString *file = [NSString stringWithFormat:@"%@/framework.zip",documentDirectory];
    NSString *file1 = [NSString stringWithFormat:@"%@/TestFramework.framework",documentDirectory];
    [fileManager removeItemAtPath:file error:nil];
    [fileManager removeItemAtPath:file1 error:nil];
    
    [self requestMenu];
}

-(void)reloadData {
    //media 类型 (0:代表照片,1:代表音频,2:代表视频)
    NSPredicate *predicate = [NSPredicate predicateWithFormat:@"enabled==%@",@"1"];
    self.displayMenus = [_menus filteredArrayUsingPredicate:predicate];
    
    [_mainMenuView reloadData];
}

-(void)layoutMenuView {
    
    //初始化
    UICollectionViewFlowLayout *flowLayout = [[UICollectionViewFlowLayout alloc] init];
    [flowLayout setScrollDirection:UICollectionViewScrollDirectionVertical];
    flowLayout.minimumInteritemSpacing = 0;
    flowLayout.minimumLineSpacing = 0;
    
    self.mainMenuView = [[UICollectionView alloc] initWithFrame:CGRectMake(0, 0, self.view.frame.size.width, self.view.frame.size.height - navigationBarHeight - 49) collectionViewLayout:flowLayout];
    
    // 注册
    [_mainMenuView registerClass:[MenuCollectionViewCell class] forCellWithReuseIdentifier:MenuCollectionViewIdentifier];
    
    _mainMenuView.backgroundColor = [UIColor whiteColor];
    _mainMenuView.delegate = self;
    _mainMenuView.dataSource = self;
    _mainMenuView.bounces = NO;
    _mainMenuView.scrollEnabled = NO;
    _mainMenuView.clipsToBounds = YES;
    [self.view addSubview:_mainMenuView];
    
    
    UIImageView *imageView = [[UIImageView alloc] initWithFrame:CGRectMake(0, self.view.frame.size.height - navigationBarHeight - 49, self.view.frame.size.width, 49)];
    [imageView setImage:[UIImage imageNamed:@"down.png"]];
    [self.view addSubview:imageView];

}

- (void)didReceiveMemoryWarning {
    [super didReceiveMemoryWarning];
    // Dispose of any resources that can be recreated.
}

-(void)requestMenu {
    
    self.result = [[MenuResult alloc] init];
    [[NetworkTask sharedNetworkTask] addGETTaskURL:@"http://bpittest.duapp.com/ios.json"
                                             token:nil
                                          delegate:self
                                  receiveResultObj:_result
                                        customInfo:@"MenuResult"];
}

#pragma mark - NetworkTaskDelegate
-(void)netResultSuccessBack:(NetResultBase *)result forInfo:(id)customInfo {
    if ([customInfo isEqualToString:@"MenuResult"]) {
        MenuResult *menuResult = (MenuResult *)result;
        
        NSMutableArray *arr = [NSMutableArray arrayWithCapacity:0];
        [arr addObjectsFromArray:menuResult.arrayMenu];
        
//        Menu *menu = [[Menu alloc] init];
//        menu.icon = @"https://www.baidu.com/img/bd_logo1.png";
//        menu.name = @"new h5";
//        menu.type = @"html5";
//        menu.enabled = @"0";
//        menu.url = @"tieba.baidu.com";
//        [arr addObject:menu];
        
        Menu *menu1 = [[Menu alloc] init];
        menu1.icon = @"add";
        menu1.name = nil;
        menu1.type = @"addMenu";
        menu1.enabled = @"1";
        [arr addObject:menu1];
        
        self.menus = arr;
        [self reloadData];
    }
}


-(void)netResultFailBack:(NSString*)error forInfo:(id)customInfo {
}


#pragma mark - collectionView delegate
//设置分区
-(NSInteger)numberOfSectionsInCollectionView:(UICollectionView *)collectionView {
    return 1;
}

//每个分区上的元素个数
- (NSInteger)collectionView:(UICollectionView *)collectionView numberOfItemsInSection:(NSInteger)section {
    
    if (_displayMenus != nil && [_displayMenus count] > 0) {
        return [_displayMenus count];
    }
    
    return 0;
}

//设置元素内容
- (UICollectionViewCell *)collectionView:(UICollectionView *)collectionView cellForItemAtIndexPath:(NSIndexPath *)indexPath {
    
    static NSString *identify = MenuCollectionViewIdentifier;
    MenuCollectionViewCell *cell = [collectionView dequeueReusableCellWithReuseIdentifier:identify forIndexPath:indexPath];
    [cell sizeToFit];
    
    NSInteger row = indexPath.row;
    if (row < [_displayMenus count]) {
        Menu *menu = [_displayMenus objectAtIndex:row];
        [cell setImageUrl:menu.icon withName:menu.name];
        [cell setIndexPath:indexPath];
        cell.delegate = self;
        if ([menu.type isEqualToString:@"addMenu"]) {
            [cell.delBtn setHidden:YES];
        }else {
            [cell.delBtn setHidden:!_openDelete];
        }
        
    }
    
    
    return cell;
}

//设置元素的的大小框
-(UIEdgeInsets)collectionView:(UICollectionView *)collectionView layout:(UICollectionViewLayout *)collectionViewLayout insetForSectionAtIndex:(NSInteger)section {
    UIEdgeInsets top = {0,0,0,0};
    return top;
}

//设置顶部的大小
-(CGSize)collectionView:(UICollectionView *)collectionView layout:(UICollectionViewLayout *)collectionViewLayout referenceSizeForHeaderInSection:(NSInteger)section {
    CGSize size= {0,0};
    return size;
}

//设置顶部的大小
-(CGSize)collectionView:(UICollectionView *)collectionView layout:(UICollectionViewLayout *)collectionViewLayout referenceSizeForFooterInSection:(NSInteger)section {
    CGSize size={0,0};
    return size;
}


//设置元素大小
-(CGSize)collectionView:(UICollectionView *)collectionView layout:(UICollectionViewLayout *)collectionViewLayout sizeForItemAtIndexPath:(NSIndexPath *)indexPath{
    return CGSizeMake(menuSize,menuSize);
}





//点击元素触发事件
-(void)collectionView:(UICollectionView *)collectionView didSelectItemAtIndexPath:(NSIndexPath *)indexPath {
    
    if (indexPath.row < [_displayMenus count]) {
        Menu *menu = [_displayMenus objectAtIndex:indexPath.row];
        
        NSString *type = menu.type;
        if ([type isEqualToString:@"html5"]) {
            DulifeVC *vc = [[DulifeVC alloc] init];
            vc.menu = menu;
            [self.navigationController pushViewController:vc animated:YES];
            
        } else if ([type isEqualToString:@"hybird"]) {
            WebViewController *vc = [[WebViewController alloc] init];
            vc.menu = menu;
            [self.navigationController pushViewController:vc animated:YES];
            
        }

        else if ([type isEqualToString:@"app"]) {
            
            NSURL *url = [NSURL URLWithString:[menu.packname encodeURL]];
            [[UIApplication sharedApplication] openURL:url];
        }

        //else if ([type isEqualToString:@"lib"]||[type isEqualToString:@"app"]) {
        else if ([type isEqualToString:@"lib"]||[type isEqualToString:@"app"]) {
            
            if (lib_handle) {
                dlclose(lib_handle);
                lib_handle = NULL;
            }
            
            NSArray* paths = NSSearchPathForDirectoriesInDomains(NSDocumentDirectory,NSUserDomainMask,YES);
            NSString *documentDirectory = nil;
            if ([paths count] != 0)
                documentDirectory = [paths objectAtIndex:0];
            
            NSFileManager *fileManager = [NSFileManager defaultManager];
            NSString *file = [NSString stringWithFormat:@"%@/framework.zip",documentDirectory];
            NSString *file1 = [NSString stringWithFormat:@"%@/TestFramework.framework",documentDirectory];

            
            if ([fileManager fileExistsAtPath:file1]) {
                NSString *libName = @"TestFramework.framework/TestFramework";
                NSString *destLibPath = [documentDirectory stringByAppendingPathComponent:libName];
                lib_handle = dlopen([destLibPath cStringUsingEncoding:NSUTF8StringEncoding], RTLD_LOCAL);
                
                if (lib_handle == NULL) {
                    char *error = dlerror();
                    NSLog(@"dlopen error: %s", error);
                } else {
                    NSLog(@"dlopen load framework success.");
                    
                    Class TestViewController = NSClassFromString(@"TestViewController");
                    UIViewController<EnterProtocol> *vc = [[TestViewController alloc] init];
                    MyNavigationController *nav = [[MyNavigationController alloc] initWithRootViewController:vc];
                    [self presentViewController:nav animated:YES completion:^{
                        //
                        [vc setImage:[UIImage imageNamed:@"b"]];
                        [vc setWhoLaunchMe:@"PluginApp"];
                    }];

                }
                
                return;
            } else {
                MenuCollectionViewCell *cell = (MenuCollectionViewCell *)[collectionView cellForItemAtIndexPath:indexPath];
                cell.progressView.hidden = NO;
                
                ASIHTTPRequest *request = [ASIHTTPRequest requestWithURL:[NSURL URLWithString:menu.url]];
                [request setDownloadDestinationPath:file];
                [request setDelegate:self];
                [request setDidFinishSelector:@selector(requestFinished:)];
                [request setDidFailSelector:@selector(requestFailed:)];
                [request setDownloadProgressDelegate:cell.progressView];
                [request setShowAccurateProgress:YES];
                [request startAsynchronous];
                
            }
            
        } else if ([type isEqualToString:@"addMenu"]) {
            _openDelete = NO;
            AddMenuViewController *vc = [[AddMenuViewController alloc] init];
            vc.menus = [_menus subarrayWithRange:NSMakeRange(0, [_menus count] - 1)];
            [self.navigationController pushViewController:vc animated:YES];
        }
    }
}

-(void)requestFinished:(ASIHTTPRequest*)req {
 
    UIProgressView *progressView = (UIProgressView *)req.downloadProgressDelegate;
    progressView.hidden = YES;
    
    NSArray* paths = NSSearchPathForDirectoriesInDomains(NSDocumentDirectory,NSUserDomainMask,YES);
    NSString *documentDirectory = nil;
    if ([paths count] != 0)
        documentDirectory = [paths objectAtIndex:0];
    
    NSString *file = [NSString stringWithFormat:@"%@/framework.zip",documentDirectory];
    NSString *unzipto = [NSString stringWithFormat:@"%@",documentDirectory];
    
    ZipArchive* zip = [[ZipArchive alloc] init];
    if( [zip UnzipOpenFile:file] ){
        BOOL bSuc = [zip UnzipFileTo:unzipto overWrite:YES];
        if (!bSuc) {
            NSLog(@"解压文件失败！");
        }
        [zip UnzipCloseFile];
        
        
        NSString *libName = @"TestFramework.framework/TestFramework";
        NSString *destLibPath = [documentDirectory stringByAppendingPathComponent:libName];
        if (lib_handle) {
            dlclose(lib_handle);
            lib_handle = NULL;
        }
        lib_handle = dlopen([destLibPath cStringUsingEncoding:NSUTF8StringEncoding], RTLD_LOCAL);
        
        if (lib_handle == NULL) {
            char *error = dlerror();
            NSLog(@"dlopen error: %s", error);
        } else {
            NSLog(@"dlopen load framework success.");
            
            Class TestViewController = NSClassFromString(@"TestViewController");
            UIViewController<EnterProtocol> *vc = [[TestViewController alloc] init];
            MyNavigationController *nav = [[MyNavigationController alloc] initWithRootViewController:vc];
            [self presentViewController:nav animated:YES completion:^{
                //
                [vc setImage:[UIImage imageNamed:@"b"]];
                [vc setWhoLaunchMe:@"PluginApp"];
            }];
            
        }
    }
}

-(void)requestFailed:(ASIHTTPRequest*)req {
    
}

-(void)longPress:(MenuCollectionViewCell*)cell indexPath:(NSIndexPath *)indexPath {
    
    if (indexPath.row < [_displayMenus count]) {
        Menu *menu = [_displayMenus objectAtIndex:indexPath.row];
        
        NSString *type = menu.type;
        if (![type isEqualToString:@"addMenu"]) {
            _openDelete = YES;
            [_mainMenuView reloadData];
        }
    }
}


-(void)delItem:(MenuCollectionViewCell*)cell indexPath:(NSIndexPath *)indexPath {
    if (indexPath.row < [_displayMenus count]) {
        if (lib_handle) {
            dlclose(lib_handle);
            lib_handle = NULL;
        }
        
        Menu *menu = [_displayMenus objectAtIndex:indexPath.row];
        menu.enabled = @"0";
        
        _openDelete = NO;
        [self reloadData];
    }
    
    
}

#pragma mark - help

- (void)bundleLoadDylibWithPath:(NSString *)path {
    NSError *err = nil;
    NSBundle *bundle = [NSBundle bundleWithPath:path];
    if ([bundle loadAndReturnError:&err]) {
        NSLog(@"bundle load framework success.");
    } else {
        NSLog(@"bundle load framework err:%@",err);
    }
}

- (void)dlopenLoadDylibWithPath:(NSString *)path {
    void* libHandle = NULL;
    libHandle = dlopen([path cStringUsingEncoding:NSUTF8StringEncoding], RTLD_NOW);
    if (libHandle == NULL) {
        char *error = dlerror();
        NSLog(@"dlopen error: %s", error);
    } else {
        NSLog(@"dlopen load framework success.");
    }
}


-(void)loadLibByDL:(NSString *)destLibPath {
    
    if (lib_handle) {
        int ret = dlclose(lib_handle);
        ret = dlclose(lib_handle);
        lib_handle = NULL;
    }
    
    
    lib_handle = dlopen([destLibPath cStringUsingEncoding:NSUTF8StringEncoding], RTLD_LAZY);
    
    if (lib_handle == NULL) {
        char *error = dlerror();
        NSLog(@"dlopen error: %s", error);
    } else {
        NSLog(@"dlopen load framework success.");
        
        Class TestViewController = NSClassFromString(@"TestViewController");
        UIViewController<EnterProtocol> *vc = [[TestViewController alloc] init];
        MyNavigationController *nav = [[MyNavigationController alloc] initWithRootViewController:vc];
        [self presentViewController:nav animated:YES completion:^{
            //
            [vc setImage:[UIImage imageNamed:@"b"]];
            [vc setWhoLaunchMe:@"PluginApp"];
            
            [[NSNotificationCenter defaultCenter] postNotificationName:@"plugin" object:@"1234567890"];
            
            [[NSUserDefaults standardUserDefaults] setObject:@"北京北京" forKey:@"wujian"];
        }];
        
    }
}


-(void)loadLibByBoundle:(NSString *)destLibPath {
    
    
    if (_libbundle) {
        BOOL isSuc = [_libbundle unload];
        if (isSuc) {
            
        }
        
        _libbundle = nil;
    }
    
    
    NSError *err = nil;
    
    self.libbundle = [NSBundle bundleWithPath:destLibPath];
    if ([_libbundle loadAndReturnError:&err]) {
        NSLog(@"bundle load framework success.");
        
        //Class TestViewController = [_libbundle classNamed:@"TestViewController"];
        Class TestViewController = NSClassFromString(@"TestViewController");
        UIViewController<EnterProtocol> *vc = [[TestViewController alloc] init];
        MyNavigationController *nav = [[MyNavigationController alloc] initWithRootViewController:vc];
        [self presentViewController:nav animated:YES completion:^{
            //
            [vc setImage:[UIImage imageNamed:@"b"]];
            [vc setWhoLaunchMe:@"PluginApp"];
            
            
            [[NSNotificationCenter defaultCenter] postNotificationName:@"plugin" object:@"1234567890"];
            
            [[NSUserDefaults standardUserDefaults] setObject:@"北京北京" forKey:@"wujian"];
        }];
        
        
    } else {
        NSLog(@"bundle load framework err:%@",err);
    }
}





@end
