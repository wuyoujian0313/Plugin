//
//  TestViewController.m
//  TestFramework
//
//  Created by wuyj on 15-1-5.
//  Copyright (c) 2015年 baidu. All rights reserved.
//

#import "TestViewController.h"
#import "ListResult.h"
#import "MyWebViewController.h"

@interface TestViewController ()<UITableViewDataSource,UITableViewDelegate>
@property(nonatomic,strong)UITableView *listTableView;
@property(nonatomic,strong)UIImageView *imageView;
@property(nonatomic,strong)UILabel *label;

@property(nonatomic,strong)NSMutableArray   *listNews;
@end

@implementation TestViewController

-(void)setImage:(UIImage *)image {
}

-(void)setWhoLaunchMe:(NSString *)msg {
}

- (void)viewDidLoad {
    [super viewDidLoad];
    // Do any additional setup after loading the view.
    self.listNews = [[NSMutableArray alloc] initWithCapacity:0];
    
    [self.view setBackgroundColor:[UIColor whiteColor]];
    self.title = @"插件主页";

    [self layoutTableView];
    
    UIBarButtonItem *leftBtn = [[UIBarButtonItem alloc] initWithTitle:@"取消" style:UIBarButtonItemStylePlain target:self action:@selector(dismiss)];
    
    self.navigationItem.leftBarButtonItem = leftBtn;
    
    NSData *data = [NSData dataWithContentsOfFile:[[NSBundle bundleForClass:self.class] pathForResource:@"json" ofType:nil]];
    
    ListResult *result = [[ListResult alloc] init];

    [result autoParseJsonData:data];
    
    [_listNews addObjectsFromArray:result.arrayList];
    
    [_listTableView reloadData];
}


-(void)layoutTableView {
    UITableView * tableView = [[UITableView alloc] initWithFrame:CGRectMake(0, 0, self.view.frame.size.width, self.view.frame.size.height-navigationBarHeight) style:UITableViewStylePlain];
    [tableView setDelegate:self];
    [tableView setDataSource:self];
    [tableView setBackgroundColor:[UIColor clearColor]];
    [tableView setSeparatorStyle:UITableViewCellSeparatorStyleSingleLine];
    [self.view addSubview:tableView];
    
    [tableView setTableFooterView:[[UIView alloc] init]];
    [self setListTableView:tableView];
}


-(void)dismiss {
    [self dismissViewControllerAnimated:YES completion:^{
        //
    }];
}

- (void)didReceiveMemoryWarning {
    [super didReceiveMemoryWarning];
    // Dispose of any resources that can be recreated.
}


#pragma mark - UITableViewDataSource
- (NSInteger)tableView:(UITableView *)tableView numberOfRowsInSection:(NSInteger)section {
    return [_listNews count];
}

- (NSInteger)numberOfSectionsInTableView:(UITableView *)tableView {
    return 1;
}

- (UITableViewCell *)tableView:(UITableView *)tableView cellForRowAtIndexPath:(NSIndexPath *)indexPath{
    
    static NSString *cellIdentifier = @"deviceTableCell";
    UITableViewCell *cell = [tableView dequeueReusableCellWithIdentifier:cellIdentifier];
    if (cell == nil) {
        cell = [[UITableViewCell alloc] initWithStyle:UITableViewCellStyleDefault reuseIdentifier:cellIdentifier];
        cell.selectionStyle = UITableViewCellSelectionStyleNone;
        cell.accessoryType = UITableViewCellAccessoryDisclosureIndicator;

        
        UILabel *titelLabel = [[UILabel alloc] initWithFrame:CGRectMake(15, 16, tableView.frame.size.width - 45, 15)];
        titelLabel.tag = 101;
        titelLabel.font = [UIFont systemFontOfSize:15];
        [cell.contentView addSubview:titelLabel];
        
        UILabel *descLabel = [[UILabel alloc] initWithFrame:CGRectMake(15,16 + 15 + 15, tableView.frame.size.width - 45, 14)];
        descLabel.tag = 102;
        descLabel.font = [UIFont systemFontOfSize:14];
        descLabel.textColor = [UIColor colorWithHex:0x8399ae];
        [cell.contentView addSubview:descLabel];
    }
    
    UILabel *titelLabel  = (UILabel *)[cell.contentView viewWithTag:101];
    UILabel *descLabel = (UILabel *)[cell.contentView viewWithTag:102];
    
    NSInteger row = indexPath.row;
    if (row < [_listNews count]) {
        Info *menu = [_listNews objectAtIndex:row];
        
        [titelLabel setText:menu.title];
        [descLabel setText:menu.pubDate];
    }
    
    return cell;
}

#pragma mark - UITableViewDelegate

- (CGFloat)tableView:(UITableView *)tableView heightForRowAtIndexPath:(NSIndexPath *)indexPath {
    return 72;
}

- (void)tableView:(UITableView *)tableView didSelectRowAtIndexPath:(NSIndexPath *)indexPath {
    if (indexPath.row < [_listNews count]) {
        Info *menu = [_listNews objectAtIndex:indexPath.row];
        MyWebViewController *vc = [[MyWebViewController alloc] init];
        vc.url = menu.link;
        [self.navigationController pushViewController:vc animated:YES];
    }
}




@end
