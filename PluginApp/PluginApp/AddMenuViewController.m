//
//  AddMenuViewController.m
//  PluginApp
//
//  Created by wuyj on 15-1-6.
//  Copyright (c) 2015年 baidu. All rights reserved.
//

#import "AddMenuViewController.h"
#import "Menu.h"
#import "SDImageCache.h"
#import "UIImageView+WebCache.h"
#import "LineView.h"
#import "ASIHTTPRequest.h"
#import "ZipArchive.h"
#import <dlfcn.h>
#import "WebViewController.h"
#import "MyNavigationController.h"
#import "DulifeVC.h"


extern void* lib_handle;

@interface AddMenuViewController ()<UITableViewDataSource,UITableViewDelegate>
@property(nonatomic,strong)UITableView *addMenuTableView;

@end

@implementation AddMenuViewController

- (void)viewDidLoad {
    [super viewDidLoad];
    self.title = @"应用中心";
    
    [self layoutMenuTableView];
}

-(void)layoutMenuTableView {
    UITableView * tableView = [[UITableView alloc] initWithFrame:CGRectMake(0, 0, self.view.frame.size.width, self.view.frame.size.height-navigationBarHeight) style:UITableViewStylePlain];
    [tableView setDelegate:self];
    [tableView setDataSource:self];
    [tableView setBackgroundColor:[UIColor clearColor]];
    [tableView setSeparatorStyle:UITableViewCellSeparatorStyleNone];
    [self.view addSubview:tableView];
    
    [tableView setTableFooterView:[[UIView alloc] init]];
    [self setAddMenuTableView:tableView];
}

- (void)didReceiveMemoryWarning {
    [super didReceiveMemoryWarning];
    // Dispose of any resources that can be recreated.
}

#pragma mark - UITableViewDataSource
- (NSInteger)tableView:(UITableView *)tableView numberOfRowsInSection:(NSInteger)section {
    return [_menus count];
}

- (NSInteger)numberOfSectionsInTableView:(UITableView *)tableView {
    return 1;
}

-(void)addApp:(UIButton *)sender {
    
    UIView *superView = sender.superview;
    id cell = superView.superview;
    if ([cell isKindOfClass:[UITableViewCell class]]) {
        NSIndexPath *indexPath = [_addMenuTableView indexPathForCell:cell];
        
        if (indexPath.row < [_menus count]) {
            Menu *menu = [_menus objectAtIndex:indexPath.row];
            
            if ([menu.enabled boolValue]) {
                NSString *type = menu.type;
                if ([type isEqualToString:@"html5"]) {
                    DulifeVC *vc = [[DulifeVC alloc] init];
                    vc.menu = menu;
                    [self.navigationController pushViewController:vc animated:YES];
                    
                } else if ([type isEqualToString:@"hybird"]) {
                    WebViewController *vc = [[WebViewController alloc] init];
                    vc.menu = menu;
                    [self.navigationController pushViewController:vc animated:YES];
                    
                } else if ([type isEqualToString:@"app"]) {
                    
                    NSURL *url = [NSURL URLWithString:[menu.packname encodeURL]];
                    [[UIApplication sharedApplication] openURL:url];
                } else if ([type isEqualToString:@"lib"]) {
                    
                    if (lib_handle) {
                        dlclose(lib_handle);
                        lib_handle = NULL;
                    }
                    
                    NSArray* paths = NSSearchPathForDirectoriesInDomains(NSDocumentDirectory,NSUserDomainMask,YES);
                    NSString *documentDirectory = nil;
                    if ([paths count] != 0)
                        documentDirectory = [paths objectAtIndex:0];
                    
                    NSFileManager *fileManager = [NSFileManager defaultManager];
                    NSString *file = [NSString stringWithFormat:@"%@/TestFramework.framework",documentDirectory];
                    
                    if ([fileManager fileExistsAtPath:file]) {
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
                            }];
                            
                        }
                    }
                    
                }

            }
            else {
                
                NSString *type = menu.type;
                if ([type isEqualToString:@"html5"]) {
                    menu.enabled = @"1";
                    
                    [_addMenuTableView reloadData];
                    
                } else if ([type isEqualToString:@"hybird"]) {
                    menu.enabled = @"1";

                    
                    [_addMenuTableView reloadData];
                    
                } else if ([type isEqualToString:@"app"]) {
                    menu.enabled = @"1";

                    
                    [_addMenuTableView reloadData];
                } else if ([type isEqualToString:@"lib"]) {
                    UITableViewCell *tCell = (UITableViewCell *)cell;
                    UIProgressView *progressView = (UIProgressView *)[tCell.contentView viewWithTag:104];
                    
                    NSArray* paths = NSSearchPathForDirectoriesInDomains(NSDocumentDirectory,NSUserDomainMask,YES);
                    NSString *documentDirectory = nil;
                    if ([paths count] != 0)
                        documentDirectory = [paths objectAtIndex:0];
                    
                    NSFileManager *fileManager = [NSFileManager defaultManager];
                    NSString *file = [NSString stringWithFormat:@"%@/framework.zip",documentDirectory];
                    NSString *file1 = [NSString stringWithFormat:@"%@/TestFramework.framework",documentDirectory];
                    [fileManager removeItemAtPath:file error:nil];
                    [fileManager removeItemAtPath:file1 error:nil];
                    
                    ASIHTTPRequest *request = [ASIHTTPRequest requestWithURL:[NSURL URLWithString:menu.url]];
                    [request setDownloadDestinationPath:file];
                    [request setDelegate:self];
                    [request setDidFinishSelector:@selector(requestFinished:)];
                    [request setDidFailSelector:@selector(requestFailed:)];
                    if ([progressView isKindOfClass:[UIProgressView class]]) {
                        progressView.hidden = NO;
                        [request setDownloadProgressDelegate:progressView];
                    }
                    
                    NSDictionary*userInfo = [NSDictionary dictionaryWithObjectsAndKeys:menu,@"menu", nil];
                    [request setUserInfo:userInfo];
                    
                    [request setShowAccurateProgress:YES];
                    [request startAsynchronous];
                }
                
                
                
            }
        }
        
    }
}

-(void)requestFinished:(ASIHTTPRequest*)req {
    
    NSArray* paths = NSSearchPathForDirectoriesInDomains(NSDocumentDirectory,NSUserDomainMask,YES);
    NSString *documentDirectory = nil;
    if ([paths count] != 0)
        documentDirectory = [paths objectAtIndex:0];
    
    NSString *file = [NSString stringWithFormat:@"%@/framework.zip",documentDirectory];
    NSString *unzipto = [NSString stringWithFormat:@"%@",documentDirectory];
    
    ZipArchive* zip = [[ZipArchive alloc] init];
    if([zip UnzipOpenFile:file] ){
        BOOL bSuc = [zip UnzipFileTo:unzipto overWrite:YES];
        if (!bSuc) {
            NSLog(@"解压文件失败！");
        }
        [zip UnzipCloseFile];
    }
    
    Menu *menu = [[req userInfo] objectForKey:@"menu"];
    menu.enabled = @"1";
    
    [_addMenuTableView reloadData];
    
    [[NSNotificationCenter defaultCenter] postNotificationName:@"uplateData" object:nil];
    
    UIProgressView *progressView = (UIProgressView *)req.downloadProgressDelegate;
    progressView.hidden = YES;
}

-(void)requestFailed:(ASIHTTPRequest*)req {
    
}


- (UITableViewCell *)tableView:(UITableView *)tableView cellForRowAtIndexPath:(NSIndexPath *)indexPath{
    
    static NSString *cellIdentifier = @"deviceTableCell";
    UITableViewCell *cell = [tableView dequeueReusableCellWithIdentifier:cellIdentifier];
    if (cell == nil) {
        cell = [[UITableViewCell alloc] initWithStyle:UITableViewCellStyleDefault reuseIdentifier:cellIdentifier];
        cell.selectionStyle = UITableViewCellSelectionStyleNone;
        cell.accessoryType = UITableViewCellAccessoryNone;
        
        UIImageView *imageView = [[UIImageView alloc] initWithFrame:CGRectMake(12, 14, 44, 44)];
        imageView.tag = 100;
        [cell.contentView addSubview:imageView];
        
        UILabel *titelLabel = [[UILabel alloc] initWithFrame:CGRectMake(24 + 44, 16, 100, 15)];
        titelLabel.tag = 101;
        titelLabel.font = [UIFont systemFontOfSize:15];
        [cell.contentView addSubview:titelLabel];
        
        UILabel *descLabel = [[UILabel alloc] initWithFrame:CGRectMake(24 + 44, 16 + 15 + 12, 200, 14)];
        descLabel.tag = 102;
        descLabel.font = [UIFont systemFontOfSize:14];
        descLabel.textColor = [UIColor colorWithHex:0x8399ae];
        [cell.contentView addSubview:descLabel];
        
        
        UIButton *addBtn = [[UIButton alloc] initWithFrame:CGRectMake(tableView.frame.size.width - 40 - 12,(72 - 22)/2.0, 40, 22)];
        addBtn.tag = 103;
        addBtn.titleLabel.font = [UIFont systemFontOfSize:13];
        [addBtn setTitleColor:[UIColor colorWithHex:0x8ab7ee] forState:UIControlStateNormal];
        [addBtn setTitleColor:[UIColor grayColor] forState:UIControlStateHighlighted];
        [addBtn addTarget:self action:@selector(addApp:) forControlEvents:UIControlEventTouchUpInside];
        [cell.contentView addSubview:addBtn];
        
        LineView *line = [[LineView alloc] initWithFrame:CGRectMake(0, 72 - kLineHeight1px, tableView.frame.size.width, kLineHeight1px)];
        [cell.contentView addSubview:line];
        
        UIProgressView *progressView = [[UIProgressView alloc] initWithProgressViewStyle:UIProgressViewStyleDefault];
        progressView.tag = 104;
        [progressView setFrame:CGRectMake(12, 72 - 5, tableView.frame.size.width - 24, 5)];
        progressView.hidden = YES;
        [cell.contentView addSubview:progressView];
    }
    
    
    UIImageView *imageView = (UIImageView *)[cell.contentView viewWithTag:100];
    UILabel *titelLabel  = (UILabel *)[cell.contentView viewWithTag:101];
    UILabel *descLabel = (UILabel *)[cell.contentView viewWithTag:102];
    UIButton *addBtn = (UIButton *)[cell.contentView viewWithTag:103];
    
    NSInteger row = indexPath.row;
    if (row < [_menus count]) {
        Menu *menu = [_menus objectAtIndex:row];
        
        [titelLabel setText:menu.name];
        [descLabel setText:menu.desc];
    
        NSString *enable = [menu enabled];
        BOOL isEnable = [enable boolValue];
        if (isEnable) {
            [addBtn setTitle:@"查看" forState:UIControlStateNormal];
            [addBtn.layer setCornerRadius:0.0];
            [addBtn.layer setBorderColor:[UIColor clearColor].CGColor];
            [addBtn.layer setBorderWidth:0];
        } else {
            [addBtn setTitle:@"添加" forState:UIControlStateNormal];
            [addBtn.layer setCornerRadius:2.0];
            [addBtn.layer setBorderColor:[UIColor colorWithHex:0x8ab7ee].CGColor];
            [addBtn.layer setBorderWidth:kLineHeight1px];
        }
        
        //取图片缓存
        SDImageCache * imageCache = [SDImageCache sharedImageCache];
        
        //从缓存取
        UIImage *default_image = [imageCache imageFromDiskCacheForKey:menu.icon];
        
        if (default_image == nil) {
            default_image = [UIImage imageNamed:@"add"];
            
            [imageView sd_setImageWithURL:[NSURL URLWithString:menu.icon]
                              placeholderImage:default_image
                                     completed:^(UIImage *image, NSError *error, SDImageCacheType cacheType, NSURL *imageURL) {
                                         if (image) {
                                             imageView.image = image;
                                             [[SDImageCache sharedImageCache] storeImage:image forKey:menu.icon];
                                         }
                                         
                                     }
             ];
        } else {
            imageView.image = default_image;
        }
        
    }
    
    return cell;
}

#pragma mark - UITableViewDelegate

- (CGFloat)tableView:(UITableView *)tableView heightForRowAtIndexPath:(NSIndexPath *)indexPath {
    return 72;
}

@end
