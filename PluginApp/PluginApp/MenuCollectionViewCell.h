//
//  MenuCollectionViewCell.h
//  PluginApp
//
//  Created by wuyj on 15-1-6.
//  Copyright (c) 2015年 baidu. All rights reserved.
//

#import <UIKit/UIKit.h>

@class MenuCollectionViewCell;

@protocol MenuCollectionCellDelegate <NSObject>

-(void)longPress:(MenuCollectionViewCell*)cell indexPath:(NSIndexPath *)indexPath;
-(void)delItem:(MenuCollectionViewCell*)cell indexPath:(NSIndexPath *)indexPath;

@end

#define menuSize                             (int)[UIScreen mainScreen].bounds.size.width/3.0
#define MenuCollectionViewIdentifier          @"MenuCollectionViewIdentifier"


@interface MenuCollectionViewCell : UICollectionViewCell

@property(nonatomic,weak) id<MenuCollectionCellDelegate> delegate;

@property(nonatomic,strong)UIImageView          *menuImageView;
@property(nonatomic,strong)UILabel              *nameLabel;
@property(nonatomic,strong)UIProgressView       *progressView;
@property(nonatomic,strong) NSIndexPath         *indexPath;
@property(nonatomic,strong) UIButton            *delBtn;


-(void)setImageUrl:(NSString *)imageUrl withName:(NSString*)name;

@end
