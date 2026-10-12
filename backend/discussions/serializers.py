from rest_framework import serializers

from .models import Comment, Discussion


class CommentSerializer(serializers.ModelSerializer):
    author_name = serializers.SerializerMethodField()

    class Meta:
        model = Comment
        fields = [
            "id",
            "discussion",
            "author",
            "author_name",
            "content",
            "created_at",
            "updated_at",
        ]

        read_only_fields = [

            "author",
            "created_at",
            "updated_at",
        ]

    def get_author_name(self, obj):
        return obj.author.get_full_name() or obj.author.username
    def validate_discussion(self, value):
        if self.instance and value.id != self.instance.discussion_id:
            raise serializers.ValidationError(
                "You cannot move a comment to another discussion."
            )
        return value

class DiscussionSerializer(serializers.ModelSerializer):
    author_name = serializers.SerializerMethodField()

    course_title = serializers.CharField(
        source="course.title",
        read_only=True,
    )

    comments = CommentSerializer(
        many=True,
        read_only=True,
    )

    class Meta:
        model = Discussion
        fields = [
            "id",
            "course",
            "course_title",
            "author",
            "author_name",
            "title",
            "content",
            "comments",
            "created_at",
            "updated_at",
        ]

        read_only_fields = [
            "author",
            "created_at",
            "updated_at",
        ]

    def get_author_name(self, obj):
        return obj.author.get_full_name() or obj.author.username